package internal

import (
	"log"

	"github.com/gofiber/fiber/v2"
)

const Port = ":8080"

func StartServer() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	log.Fatal(app.Listen(Port))
}
