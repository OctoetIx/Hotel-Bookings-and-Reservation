package main

import (
	"log"

	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/config"
	"github.com/gofiber/fiber/v2"
	"github.com/joho/godotenv"
)



func main() {
	err :=godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})
	config.ConnectDatabase()

	app.Listen(":8080")
}
