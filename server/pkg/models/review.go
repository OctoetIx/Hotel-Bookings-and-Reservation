package models

import "gorm.io/gorm"

type Review struct {
	gorm.Model
	UserID uint
	RoomID uint
	Rating int
	Comment string
}
