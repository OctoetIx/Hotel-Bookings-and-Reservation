package payment

import (
	"context"

	//"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/uow"
)

type Repository interface {
	Create(ctx context.Context, p *Payment) error
	Update(ctx context.Context, p *Payment) error

	FindByID(ctx context.Context, id uint) (*Payment, error)
	FindByReference(ctx context.Context, ref string) (*Payment, error)
	FindByBookingID(ctx context.Context, bookingID uint) ([]Payment, error)

	UpdateStatus(ctx context.Context, id uint, status PaymentStatus) error
	
	LockPayment(ctx context.Context, reference string) (unlock func(), err error)

	FindPendingPayments(ctx context.Context) ([]Payment, error)
	MarkAsFailed(ctx context.Context, id uint) error
	//WithTransaction(ctx context.Context, fn func(uow.UnitOfWork) error) error
}
