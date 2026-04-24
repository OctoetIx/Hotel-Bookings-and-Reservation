package booking

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/booking"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/room"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/redis"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
	goredis "github.com/redis/go-redis/v9"
)

type Service struct {
	repo        booking.Repository
	tracer      trace.Tracer
	roomRepo    room.Repository
	locker      *redis.RedisLocker
	redisClient *goredis.Client
}

func NewService(
	repo booking.Repository,
	roomRepo room.Repository,
	locker *redis.RedisLocker,
	client *goredis.Client,
) *Service {
	return &Service{
		repo:        repo,
		tracer:      otel.Tracer("booking-service"),
		roomRepo:    roomRepo,
		locker:      locker,
		redisClient: client,
	}
}

func (s *Service) availabilityKey(roomID uint, date time.Time) string {
	return fmt.Sprintf("availability:%d:%s", roomID, date.Format("2006-01-02"))
}

/* =========================
   CREATE BOOKING
========================= */

func (s *Service) CreateBooking(ctx context.Context, b *booking.Booking) error {

	ctx, span := s.tracer.Start(ctx, "CreateBooking")
	defer span.End()

	if err := b.ValidateDates(); err != nil {
		span.RecordError(err)
		return err
	}

	b.Reference = GenerateBookingReference()
	b.Status = booking.BookingStatusPending
	b.PaymentStatus = booking.PaymentStatusPending
	b.ExpiresAt = time.Now().Add(15 * time.Minute)

	return s.withRoomLock(ctx, b.RoomID, func() error {

		err := s.repo.WithTransaction(ctx, func(tx booking.Repository) error {

			existing, err := tx.FindOverlappingBookings(
				ctx,
				b.RoomID,
				b.CheckInDate,
				b.CheckOutDate,
			)
			if err != nil {
				return err
			}

			if len(existing) > 0 {
				return errors.New("room already booked for selected dates")
			}

			return tx.Create(ctx, b)
		})
		if err != nil {
			return err
		}

		// cache occupancy
		pipe := s.redisClient.Pipeline()

		for d := b.CheckInDate; d.Before(b.CheckOutDate); d = d.AddDate(0, 0, 1) {
			key := s.availabilityKey(b.RoomID, d)
			pipe.Set(ctx, key, "1", 24*time.Hour)
		}

		_, err = pipe.Exec(ctx)
		return err
	})
}

/* =========================
   CONFIRM BOOKING
========================= */

func (s *Service) ConfirmBooking(ctx context.Context, bookingID uint) error {

	ctx, span := s.tracer.Start(ctx, "ConfirmBooking")
	defer span.End()

	b, err := s.repo.FindByID(ctx, bookingID)
	if err != nil {
		return err
	}

	if b.Status == booking.BookingStatusCancelled {
		return errors.New("cannot confirm cancelled booking")
	}

	if b.PaymentStatus != booking.PaymentStatusCompleted {
		return errors.New("cannot confirm unpaid booking")
	}

	if time.Now().After(b.ExpiresAt) {
		return errors.New("booking expired")
	}

	b.Status = booking.BookingStatusConfirmed
	return s.repo.Update(ctx, b)
}

/* =========================
   CANCEL BOOKING
========================= */

func (s *Service) CancelBooking(ctx context.Context, bookingID uint) error {

	ctx, span := s.tracer.Start(ctx, "CancelBooking")
	defer span.End()

	b, err := s.repo.FindByID(ctx, bookingID)
	if err != nil {
		return err
	}

	return s.withRoomLock(ctx, b.RoomID, func() error {

		if b.Status == booking.BookingStatusCancelled {
			return errors.New("booking already cancelled")
		}

		b.Cancel()

		if err := s.repo.Update(ctx, b); err != nil {
			return err
		}

		pipe := s.redisClient.Pipeline()

		for d := b.CheckInDate; d.Before(b.CheckOutDate); d = d.AddDate(0, 0, 1) {
			key := s.availabilityKey(b.RoomID, d)
			pipe.Set(ctx, key, "0", 24*time.Hour)
		}

		_, err := pipe.Exec(ctx)
		return err
	})
}

/* =========================
   LIST / GET
========================= */

func (s *Service) ListBookings(ctx context.Context, page, limit int) ([]booking.Booking, int64, error) {
	return s.repo.List(ctx, page, limit)
}

func (s *Service) GetBookingByID(ctx context.Context, id uint) (*booking.Booking, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *Service) GetBookingsByUserID(ctx context.Context, userID uint, page, limit int) ([]booking.Booking, int64, error) {
	return s.repo.FindByUser(ctx, userID, page, limit)
}

/* =========================
   CONFIRM PAYMENT
========================= */

func (s *Service) ConfirmPaymentAndBooking(ctx context.Context, bookingID uint) error {

	b, err := s.repo.FindByID(ctx, bookingID)
	if err != nil {
		return err
	}

	return s.withRoomLock(ctx, b.RoomID, func() error {

		return s.repo.WithTransaction(ctx, func(tx booking.Repository) error {

			b, err := tx.FindByID(ctx, bookingID)
			if err != nil {
				return err
			}

			if b.Status == booking.BookingStatusCancelled {
				return errors.New("cannot confirm cancelled booking")
			}

			if b.PaymentStatus == booking.PaymentStatusCompleted {
				return errors.New("payment already completed")
			}

			b.PaymentStatus = booking.PaymentStatusCompleted
			b.Status = booking.BookingStatusConfirmed

			return tx.Update(ctx, b)
		})
	})
}

/* =========================
   AVAILABILITY
========================= */

func (s *Service) CheckRoomAvailability(
	ctx context.Context,
	roomID uint,
	checkIn, checkOut time.Time,
) (bool, error) {

	if !checkIn.Before(checkOut) {
		return false, errors.New("invalid booking dates")
	}

	pipe := s.redisClient.Pipeline()
	cmds := []*goredis.StringCmd{}

	for d := checkIn; d.Before(checkOut); d = d.AddDate(0, 0, 1) {
		cmds = append(cmds, pipe.Get(ctx, s.availabilityKey(roomID, d)))
	}

	_, err := pipe.Exec(ctx)
	if err != nil && err != goredis.Nil {
		return false, err
	}

	for _, cmd := range cmds {
		if cmd.Err() == nil && cmd.Val() == "1" {
			return false, nil
		}
	}

	bookings, err := s.repo.FindOverlappingBookings(ctx, roomID, checkIn, checkOut)
	if err != nil {
		return false, err
	}

	available := len(bookings) == 0

	val := "0"
	if !available {
		val = "1"
	}

	for d := checkIn; d.Before(checkOut); d = d.AddDate(0, 0, 1) {
		s.redisClient.Set(ctx, s.availabilityKey(roomID, d), val, 10*time.Minute)
	}

	return available, nil
}

/* =========================
   EXPIRE BOOKINGS
========================= */

func (s *Service) ExpireBookings(ctx context.Context) error {

	now := time.Now()

	bookings, err := s.repo.FindExpiredBookings(ctx, now)
	if err != nil {
		return err
	}

	for i := range bookings {
		b := &bookings[i]

		if b.Status == booking.BookingStatusPending {
			b.Status = booking.BookingStatusCancelled

			if err := s.repo.Update(ctx, b); err != nil {
				return err
			}
		}
	}

	return nil
}

/* =========================
   LOCK HELPER
========================= */

func (s *Service) withRoomLock(
	ctx context.Context,
	roomID uint,
	fn func() error,
) error {

	var unlock func()
	var err error

	for i := 0; i < 3; i++ {
		unlock, err = s.locker.LockResource(ctx, "room", fmt.Sprintf("%d", roomID), 5*time.Second)
		if err == nil {
			break
		}
		time.Sleep(time.Duration(100*(i+1)) * time.Millisecond)
	}

	if err != nil {
		return err
	}
	defer unlock()

	return fn()
}