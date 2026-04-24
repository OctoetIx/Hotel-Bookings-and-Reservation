package booking

import (
	"context"
	"time"

	"gorm.io/gorm"
)

type Repository interface {
	Create(ctx context.Context, b *Booking) error
	Update(ctx context.Context, b *Booking) error
	Delete(ctx context.Context, id uint) error

	FindByID(ctx context.Context, id uint) (*Booking, error)

	List(ctx context.Context, page, limit int) ([]Booking, int64, error)

	FindAll(
		ctx context.Context,
		status *PaymentStatus,
		page int,
		limit int,
	) ([]Booking, int64, error)

	FindByUser(
		ctx context.Context,
		userID uint,
		page int,
		limit int,
	) ([]Booking, int64, error)

	FindByRoomID(ctx context.Context, roomID uint) ([]Booking, error)

	FindOverlappingBookings(
		ctx context.Context,
		roomID uint,
		checkIn time.Time,
		checkOut time.Time,
	) ([]Booking, error)

	UpdatePaymentStatus(ctx context.Context, id uint, status PaymentStatus) error

	UpdatePaymentStatusTx(
		ctx context.Context,
		tx *gorm.DB,
		id uint,
		status PaymentStatus,
	) error

	LockRoom(ctx context.Context, roomID uint) error

	WithTransaction(ctx context.Context, fn func(tx Repository) error) error

	FindExpiredBookings(ctx context.Context, now time.Time) ([]Booking, error)
}