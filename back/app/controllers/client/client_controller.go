package client

import (
	"github.com/gofiber/fiber/v2"
)

func CheckUserId(c *fiber.Ctx) error {
	return c.JSON(fiber.Map{
		"message": "hellp",
	})
}
