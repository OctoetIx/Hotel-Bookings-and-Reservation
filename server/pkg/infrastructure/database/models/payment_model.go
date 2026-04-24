package models

import "time"

type Payment struct {
	ID uint `gorm:"primaryKey"`

	BookingID uint `gorm:"not null;index"` 

	Reference string `gorm:"uniqueIndex;not null"`  

	Amount float64 `gorm:"not null"`

	Method string `gorm:"type:varchar(50);not null"`  
	Status string `gorm:"type:varchar(50);index"`     

	Provider string `gorm:"type:varchar(50)"`
	Booking   Booking `gorm:"foreignKey:BookingID"`

	PaidAt *time.Time

	CreatedAt time.Time
	UpdatedAt time.Time
}