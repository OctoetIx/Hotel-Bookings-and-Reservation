package config

import (
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database"
	session "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/user_session"

	auditrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/audit_logs"
	bookingrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/booking"
	paymentrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/payment"
	roomrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/room"
	userrepo "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/repositories/user"

	redisinfra "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/redis"

	uowinfra "github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/infrastructure/database/uow"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/audit_logs"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/booking"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/payment"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/room"
	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/usecase/user"
)

var (
	UserService     *user.Service
	RoomService     *room.Service
	BookingService  *booking.Service
	AuditLogService *audit_logs.Service
	PaymentService  *payment.Service
)

func InitServices() {

	userRepo := userrepo.NewUserRepository(database.DB)
	sessionRepo := session.NewUserSessionRepository(database.DB)
	roomRepo := roomrepo.NewRoomRepository(database.DB)
	bookingRepo := bookingrepo.NewBookingRepository(database.DB)
	auditRepo := auditrepo.NewAuditRepository(database.DB)
	paymentRepo := paymentrepo.NewPaymentRepository(database.DB)
	uowManager := uowinfra.NewManager(database.DB)


	rateLimiter := redisinfra.NewRedisRateLimiter(Redis)
	tokenBlacklist := redisinfra.NewRedisBlacklist(Redis)
	locker := redisinfra.NewRedisLocker(Redis)

	publisher := audit_logs.NewLogPublisher()

	AuditLogService = audit_logs.NewService(auditRepo, publisher)

	UserService = user.NewService(userRepo, rateLimiter, sessionRepo , AuditLogService, tokenBlacklist )
	RoomService = room.NewService(roomRepo, locker, Redis)
	BookingService = booking.NewService(bookingRepo, roomRepo, locker, Redis)
	AuditLogService = audit_logs.NewService(auditRepo, publisher)
	PaymentService = payment.NewService(paymentRepo, uowManager, locker, Redis)
}