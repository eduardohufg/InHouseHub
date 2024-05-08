package handler

import (
	"InHouseHub/database"
	"InHouseHub/model"
	"InHouseHub/pkg"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	var newUser model.User
	if err := c.BodyParser(&newUser); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	// Get database
	db := c.Locals("db").(*database.Database)

	_, err := db.GetUserByEmail(newUser.Email)

	if err != nil {
		// Hash password
		if password, err := pkg.HashPassword(newUser.Password); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to hash password",
			})
		} else {
			newUser.Password = password

			// Create userS
			if id, err := db.CreateUser(newUser); err != nil {
				return c.Status(500).JSON(fiber.Map{
					"message": "Failed to create user",
				})
			} else {
				// Generate token
				if token, err := pkg.GenerateToken(id); err != nil {
					return c.Status(500).JSON(fiber.Map{
						"message": "Failed to generate token",
					})
				} else {
					return c.Status(200).JSON(fiber.Map{
						"message": "Register",
						"token":   token,
					})
				}
			}
		}
	} else {
		return c.Status(400).JSON(fiber.Map{
			"message": "User already exists",
		})
	}
}
