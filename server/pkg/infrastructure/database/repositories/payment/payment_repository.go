package repositories

import (
	"context"

	domain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/payments"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/models"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type PaymentRepository struct {
	db *gorm.DB
}

func NewPaymentRepository(db *gorm.DB) *PaymentRepository {
	return &PaymentRepository{db: db}
}

//
// =========================
// CREATE
// =========================
//

func (r *PaymentRepository) Create(ctx context.Context, p *domain.Payment) error {
	model := ToPaymentModel(p)

	if err := r.db.WithContext(ctx).Create(model).Error; err != nil {
		return err
	}

	// sync back
	p.ID = model.ID
	p.CreatedAt = model.CreatedAt
	p.UpdatedAt = model.UpdatedAt

	return nil
}

//
// =========================
// UPDATE
// =========================
//

func (r *PaymentRepository) Update(ctx context.Context, p *domain.Payment) error {
	model := ToPaymentModel(p)

	return r.db.WithContext(ctx).
		Model(&models.Payment{}).
		Where("id = ?", p.ID).
		Updates(model).Error
}

//
// =========================
// FIND BY ID
// =========================
//

func (r *PaymentRepository) FindByID(ctx context.Context, id uint) (*domain.Payment, error) {
	var model models.Payment

	if err := r.db.WithContext(ctx).First(&model, id).Error; err != nil {
		return nil, err
	}

	return ToPaymentDomain(&model), nil
}

//
// =========================
// FIND BY REFERENCE
// =========================
//

func (r *PaymentRepository) FindByReference(ctx context.Context, ref string) (*domain.Payment, error) {
	var model models.Payment

	if err := r.db.WithContext(ctx).
		Where("reference = ?", ref).
		First(&model).Error; err != nil {
		return nil, err
	}

	return ToPaymentDomain(&model), nil
}

//
// =========================
// FIND BY BOOKING ID
// =========================
//

func (r *PaymentRepository) FindByBookingID(ctx context.Context, bookingID uint) ([]domain.Payment, error) {
	var modelsList []models.Payment

	if err := r.db.WithContext(ctx).
		Where("booking_id = ?", bookingID).
		Find(&modelsList).Error; err != nil {
		return nil, err
	}

	return ToPaymentDomains(modelsList), nil
}

//
// =========================
// UPDATE STATUS
// =========================
//

func (r *PaymentRepository) UpdateStatus(
	ctx context.Context,
	id uint,
	status domain.PaymentStatus,
) error {

	update := map[string]interface{}{
		"status": string(status),
	}

	if status == domain.PaymentCompleted {
		update["paid_at"] = gorm.Expr("NOW()")
	}

	return r.db.WithContext(ctx).
		Model(&models.Payment{}).
		Where("id = ?", id).
		Updates(update).Error
}

//
// =========================
// FIND PENDING PAYMENTS
// =========================
//

func (r *PaymentRepository) FindPendingPayments(ctx context.Context) ([]domain.Payment, error) {
	var modelsList []models.Payment

	if err := r.db.WithContext(ctx).
		Where("status = ?", string(domain.PaymentPending)).
		Find(&modelsList).Error; err != nil {
		return nil, err
	}

	return ToPaymentDomains(modelsList), nil
}

//
// =========================
// MARK AS FAILED
// =========================
//

func (r *PaymentRepository) MarkAsFailed(ctx context.Context, id uint) error {
	return r.db.WithContext(ctx).
		Model(&models.Payment{}).
		Where("id = ?", id).
		Update("status", string(domain.PaymentFailed)).Error
}

//
// =========================
// LOCK PAYMENT (ROW LOCK)
// =========================
//

func (r *PaymentRepository) LockPayment(
	ctx context.Context,
	reference string,
) (func(), error) {

	var model models.Payment

	err := r.db.WithContext(ctx).
		Clauses(clause.Locking{Strength: "UPDATE"}).
		Where("reference = ?", reference).
		First(&model).Error

	if err != nil {
		return nil, err
	}

	// DB releases lock automatically at transaction end
	return func() {}, nil
}