package routes

import (
	"rg_backend/app/controllers/admin"

	"github.com/gofiber/fiber/v2"
)

func AdminRoutes(app fiber.Router) {
	apiRoutes := app.Group("api")

	adminRoutes := apiRoutes.Group("admin")
	redeemRoutes := adminRoutes.Group("redeem")
	redeemRoutes.Get("/", admin.GetAllRedeem)
	redeemRoutes.Get("/:id", admin.GetRedeem)
	redeemRoutes.Patch("/:id", admin.UpdateRedeemStatus)
}
