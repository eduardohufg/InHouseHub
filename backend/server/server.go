package server

import (
	"log"

	"InHouseHub/config"
	"InHouseHub/database"
	"InHouseHub/server/handler"
	"InHouseHub/socket"

	jwtware "github.com/gofiber/contrib/jwt"
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

	// Public Routes

	// Auth
	auth := api.Group("/auth")
	auth.Post("/login", handler.Login)

	// User
	user := api.Group("/user")
	user.Post("/register", handler.Register)

	// Restricted Routes

	// JWT Middleware
	app.Use(jwtware.New(jwtware.Config{
		SigningKey: jwtware.SigningKey{Key: []byte(config.Get("SECRET_KEY"))},
	}))

	// Auth
	api.Get("/auth", handler.Auth)

	log.Fatal(app.Listen(config.Get("SERVER_PORT")))
}
