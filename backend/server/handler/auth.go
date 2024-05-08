package handler

import (
	"log"

	"InHouseHub/model"

	"github.com/gofiber/fiber/v2"
)

func Login(c *fiber.Ctx) error {
	var user model.User
	if err := c.BodyParser(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "Invalid request",
		})
	}

	log.Println(user)

	return c.Status(200).JSON(fiber.Map{
		"message": "Login",
	})
}