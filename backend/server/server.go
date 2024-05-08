package server

import (
	"log"

	"InHouseHub/config"
	"InHouseHub/database"
	"InHouseHub/server/handler"
	"InHouseHub/socket"

	"github.com/gofiber/fiber/v2"
)

func StartServer(db *database.Database) {
	app := fiber.New()

	// Database
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)
		return c.Next()
	})

	// Socket
	socket.SetupSocket(app)

	// Api
	api := app.Group("/api")

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Post("/register", handler.Register)

	log.Fatal(app.Listen(config.Get("SERVER_PORT")))
}
