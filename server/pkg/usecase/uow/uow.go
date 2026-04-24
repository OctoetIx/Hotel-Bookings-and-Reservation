package uow

import (
	"context"

	bookingdomain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/booking"
	paymentdomain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/payments"
)

type PaymentRepository interface {
	FindByReference(ctx context.Context, ref string) (*paymentdomain.Payment, error)
	UpdateStatus(ctx context.Context, id uint, status paymentdomain.PaymentStatus) error
	LockPayment(ctx context.Context, reference string) (func(), error)
}

type BookingRepository interface {
	FindByID(ctx context.Context, id uint) (*bookingdomain.Booking, error)
	Update(ctx context.Context, b *bookingdomain.Booking) error
}

type UnitOfWork interface {
	Payment() PaymentRepository
	Booking() BookingRepository
}