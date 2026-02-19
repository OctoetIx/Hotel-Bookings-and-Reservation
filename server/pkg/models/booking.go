package models

import ("time"
"gorm.io/gorm")

type Booking struct {
	gorm.Model
	UserID   uint
	RoomID   uint
	CheckIn  time.Time
	CheckOut time.Time
}
