package redis

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type RedisLocker struct {
	client *redis.Client
}

func NewRedisLocker(client *redis.Client) *RedisLocker {
	return &RedisLocker{client: client}
}

func (r *RedisLocker) LockResource(
	ctx context.Context,
	resource string,
	id string,
	expiry time.Duration,
) (func(), error) {

	key := fmt.Sprintf("%s:%s", resource, id)
	token := uuid.NewString()

	res, err := r.client.SetArgs(ctx, key, token, redis.SetArgs{
		Mode: "NX",
		TTL:  expiry,
	}).Result()
	if err != nil {
		return nil, err
	}

	if res != "OK" {
		return nil, fmt.Errorf("resource %s is locked", key)
	}

	stopChan := make(chan struct{})
	var once sync.Once

	// 🔁 Heartbeat (TTL refresh)
	go func() {
		ticker := time.NewTicker(expiry / 2)
		defer ticker.Stop()

		script := `
		if redis.call("GET", KEYS[1]) == ARGV[1] then
			return redis.call("PEXPIRE", KEYS[1], ARGV[2])
		else
			return 0
		end
		`

		for {
			select {
			case <-ticker.C:
				_, err := r.client.Eval(
					ctx, //  use request context
					script,
					[]string{key},
					token,
					int(expiry.Milliseconds()),
				).Result()

				if err != nil {
					// optional: log
					fmt.Printf("heartbeat failed for %s: %v\n", key, err)
				}

			case <-stopChan:
				return
			}
		}
	}()

	unlock := func() {
		once.Do(func() { //  prevent double close
			close(stopChan)

			script := `
			if redis.call("GET", KEYS[1]) == ARGV[1] then
				return redis.call("DEL", KEYS[1])
			else
				return 0
			end
			`

			_, err := r.client.Eval(
				ctx, //  use same context
				script,
				[]string{key},
				token,
			).Result()

			if err != nil {
				fmt.Printf("failed to release lock %s: %v\n", key, err)
			}
		})
	}

	return unlock, nil
}