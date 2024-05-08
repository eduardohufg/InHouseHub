package internal

import (
	"log"

	"InHouseHub/internal/handler"

	"github.com/gofiber/fiber/v2"
)

const Port = ":8080"

func StartServer() {
	app := fiber.New()

	// Auth
	auth := app.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := app.Group("/user")
	user.Post("/register", handler.Register)

	log.Fatal(app.Listen(Port))
}
