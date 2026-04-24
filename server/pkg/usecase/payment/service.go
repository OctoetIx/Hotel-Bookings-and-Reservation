package payment

import (
	"context"
	"errors"
	"fmt"
	"time"

	bookingdomain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/booking"
	domain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/payments"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/redis"
	uowinfra "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/uow"
	uow "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/uow"
	goredis "github.com/redis/go-redis/v9"
)

type Service struct {
	repo   domain.Repository
	uowManager    *uowinfra.Manager
	locker *redis.RedisLocker
	client *goredis.Client
}

func NewService(
	repo domain.Repository,
	uowManager *uowinfra.Manager,
	locker *redis.RedisLocker,
	client *goredis.Client,
) *Service {
	return &Service{
		repo:   repo,
		uowManager:    uowManager,
		locker: locker,
		client: client,
	}
}

func generatePaymentReference() string {
	return fmt.Sprintf("PAY-%d", time.Now().UnixNano())
}

func (s *Service) InitiatePayment(
	ctx context.Context,
	bookingID uint,
	amount float64,
	method domain.PaymentMethod,
	provider string,
) (*domain.Payment, error) {

	p := &domain.Payment{
		Reference: generatePaymentReference(),
		BookingID: bookingID,
		Amount:    amount,
		Method:    method,
		Status:    domain.PaymentPending,
		Provider:  provider,
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(ctx, p); err != nil {
		return nil, err
	}

	return p, nil
}

func (s *Service) CompletePayment(ctx context.Context, reference string) error {

	//  Distributed lock
	unlockRedis, err := s.locker.LockResource(ctx, "payments", reference, 5*time.Second)
	if err != nil {
		return err
	}
	defer unlockRedis()

	return s.uowManager.WithTransaction(ctx, func(tx uow.UnitOfWork) error {

		paymentRepo := tx.Payment()
		bookingRepo := tx.Booking()

		//  Row lock
		unlockDB, err := paymentRepo.LockPayment(ctx, reference)
		if err != nil {
			return err
		}
		defer unlockDB()

		// Fetch payment
		p, err := paymentRepo.FindByReference(ctx, reference)
		if err != nil {
			return err
		}

		// Idempotency
		if p.Status == domain.PaymentCompleted {
			return nil
		}
		if p.Status == domain.PaymentFailed {
			return errors.New("cannot complete failed payment")
		}

		// Update payment
		if err := paymentRepo.UpdateStatus(ctx, p.ID, domain.PaymentCompleted); err != nil {
			return err
		}

		// Update booking (SAME TX )
		b, err := bookingRepo.FindByID(ctx, p.BookingID)
		if err != nil {
			return err
		}

		if b.Status != bookingdomain.BookingStatusConfirmed {
			b.Status = bookingdomain.BookingStatusConfirmed
			b.PaymentStatus = bookingdomain.PaymentStatusCompleted

			if err := bookingRepo.Update(ctx, b); err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *Service) FailPayment(ctx context.Context, reference string) error {

	unlock, err := s.locker.LockResource(
		ctx,
		"payments",
		reference,
		5*time.Second,
	)
	if err != nil {
		return err
	}
	defer unlock()

	p, err := s.repo.FindByReference(ctx, reference)
	if err != nil {
		return err
	}

	if p.Status == domain.PaymentCompleted {
		return errors.New("payment already completed")
	}

	return s.repo.MarkAsFailed(ctx, p.ID)
}

func (s *Service) GetPaymentByReference(
	ctx context.Context,
	ref string,
) (*domain.Payment, error) {
	return s.repo.FindByReference(ctx, ref)
}