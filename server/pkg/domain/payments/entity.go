package payment

import "time"

type PaymentStatus string

const (
	PaymentPending   PaymentStatus = "PENDING"
	PaymentCompleted PaymentStatus = "COMPLETED"
	PaymentFailed    PaymentStatus = "FAILED"
	PaymentRefunded  PaymentStatus = "REFUNDED"
)

type PaymentMethod string

const (
	MethodCard     PaymentMethod = "CARD"
	MethodBank     PaymentMethod = "BANK"
	MethodTransfer PaymentMethod = "TRANSFER"
)
type Payment struct {
	ID		uint
	BookingID	uint
	Reference string
	Amount  float64
	Method PaymentMethod
	Status PaymentStatus
	Provider string
	PaidAt *time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}