package routes

import (
	"rg_backend/app/controllers/auth"

	"github.com/gofiber/fiber/v2"
)

func AuthRoutes(app fiber.Router) {
	apiRoutes := app.Group("api")

	AuthRoutes := apiRoutes.Group("auth")

	AuthRoutes.Post("/login", auth.LoginUser)
}
