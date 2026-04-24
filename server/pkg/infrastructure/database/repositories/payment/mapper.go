package repositories

import(
	domain "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/domain/payments"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/models"
	
)

func ToPaymentModel(p *domain.Payment) *models.Payment {
	return &models.Payment{
		ID:        p.ID,
		BookingID: p.BookingID,
		Reference: p.Reference,
		Amount:    p.Amount,
		Method:    string(p.Method),
		Status:    string(p.Status),
		Provider:  p.Provider,
		PaidAt:    p.PaidAt,
		CreatedAt: p.CreatedAt,
		UpdatedAt: p.UpdatedAt,
	}
}

func ToPaymentDomain(m *models.Payment) *domain.Payment{
	return &domain.Payment{
		ID:        m.ID,
		BookingID: m.BookingID,
		Reference: m.Reference,
		Amount:    m.Amount,
		Method:    domain.PaymentMethod(m.Method),
		Status:    domain.PaymentStatus(m.Status),
		Provider:  m.Provider,
		PaidAt:    m.PaidAt,
		CreatedAt: m.CreatedAt,
		UpdatedAt: m.UpdatedAt,
	}
}

func ToPaymentDomains(modelsList []models.Payment) []domain.Payment {

	result := make([]domain.Payment, 0, len(modelsList))

	for i := range modelsList {
		result = append(result, *ToPaymentDomain(&modelsList[i]))
	}
	return result
}