package uow

import (
	"context"

	"gorm.io/gorm"

	paymentrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/payment"
	bookingrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/booking"

	usecaseuow "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/uow"
)

type unitOfWork struct {
	tx *gorm.DB
}

func (u *unitOfWork) Payment() usecaseuow.PaymentRepository {
	return paymentrepo.NewPaymentRepository(u.tx)
}

func (u *unitOfWork) Booking() usecaseuow.BookingRepository {
	return bookingrepo.NewBookingRepository(u.tx)
}

type Manager struct {
	db *gorm.DB
}

func NewManager(db *gorm.DB) *Manager {
	return &Manager{db: db}
}

func (m *Manager) WithTransaction(
	ctx context.Context,
	fn func(usecaseuow.UnitOfWork) error,
) error {

	return m.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		u := &unitOfWork{tx: tx}
		return fn(u)
	})
}