package routes

import (
	"rg_backend/app/controllers/client"

	"github.com/gofiber/fiber/v2"
)

func ClientRoutes(app fiber.Router) {
	apiRoutes := app.Group("api")

	clientRoutes := apiRoutes.Group("client")
	clientRoutes.Post("/redeem", client.SaveUserData)
}
