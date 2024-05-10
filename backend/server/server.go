package server

import (
	"log"

	"InHouseHub/config"
	"InHouseHub/database"
	"InHouseHub/mqtt"
	"InHouseHub/server/handler"
	"InHouseHub/socket"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func StartServer(db *database.Database, mqttBroadcast <-chan mqtt.Message) {
	app := fiber.New()

	// Cors
	app.Use(cors.New())

	// Database
	app.Use(func(c *fiber.Ctx) error {
		c.Locals("db", db)
		return c.Next()
	})

	// Static
	app.Static("/", "./public")

	// WebRTC
	socket.StartWebRTC(app)

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

	// Socket
	socket.SetupSocket(app, mqttBroadcast)

	// Auth
	api.Get("/auth", handler.Auth)

	// Start the server
	log.Fatal(app.ListenTLS(config.Get("SERVER_PORT"), "cert/cert.pem", "cert/key.pem"))
}
