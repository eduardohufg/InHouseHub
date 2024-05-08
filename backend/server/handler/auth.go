package handler

import (
	"InHouseHub/database"
	"InHouseHub/model"
	"InHouseHub/pkg"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	// Get database
	db := c.Locals("db").(*database.Database)

	// Get user by email
	u, err := db.GetUserByEmail(user.Email)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "User not found",
		})
	}

	// Compare password
	if isValid := pkg.CheckPasswordHash(user.Password, u.Password); isValid {
		if token, err := pkg.GenerateToken(u.ID.Hex()); err != nil {
			return c.Status(500).JSON(fiber.Map{
				"message": "Failed to generate token",
			})
		} else {
			return c.Status(200).JSON(fiber.Map{
				"message": "Login",
				"token":   token,
			})
		}
	} else {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid password",
		})
	}
}
