package handler

import (
	"InHouseHub/database"
	"InHouseHub/model"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	// Get database
	db := c.Locals("db").(*database.Database)

	// Create user
	if err := db.CreateUser(user); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "Failed to create user",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Register",
	})
}
