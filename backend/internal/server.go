package internal

import (
	"log"

	"InHouseHub/internal/database"
	"InHouseHub/internal/handler"

	"github.com/gofiber/fiber/v2"
)

const Port = ":8080"

func StartServer(db database.Database) {
	app := fiber.New()

	// Database
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)
		return c.Next()
	})

	// Auth
	auth := app.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := app.Group("/user")
	user.Post("/register", handler.Register)

	log.Fatal(app.Listen(Port))
}
