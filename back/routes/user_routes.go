package routes

import (
	"rg_backend/app/controllers/auth"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app fiber.Router) {
	apiRoutes := app.Group("api")

	UserRoutes := apiRoutes.Group("user")

	UserRoutes.Get("/", auth.GetUser)
}
