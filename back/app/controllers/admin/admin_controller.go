package admin

import (
	"rg_backend/app/models"
	"rg_backend/app/requests"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/gookit/validate"
)

type RedeemResponse struct {
	Success bool            `json:"success"`
	Message string          `json:"message"`
	Data    []models.Redeem `json:"data"`
}

func GetAllRedeem(c *fiber.Ctx) error {
	redeems := models.Redeem{}
	testredeemdata := []models.Redeem{}
	// result := map[string]interface
	if err := redeems.GetRedeem().Preload("RedeemLogs").Find(&testredeemdata); err.Error != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error.Error(),
			Data:    []models.Redeem{},
		}
		return c.Status(500).JSON(response)
	}
	response := RedeemResponse{
		Success: true,
		Message: "Get Redeem Data Success",
		Data:    testredeemdata,
	}
	return c.JSON(response)
}

func GetRedeem(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error(),
			Data:    []models.Redeem{},
		}
		return c.Status(500).JSON(response)
	}
	redeems := models.Redeem{}
	testredeemdata := []models.Redeem{}
	// result := map[string]interface
	if err := redeems.GetRedeem().First(&testredeemdata, id); err.Error != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error.Error(),
			Data:    []models.Redeem{},
		}
		return c.Status(404).JSON(response)
	}
	response := RedeemResponse{
		Success: true,
		Message: "Get Single Redeem Data Success",
		Data:    testredeemdata,
	}
	return c.JSON(response)
}

func UpdateRedeemStatus(c *fiber.Ctx) error {
	id, _ := strconv.ParseUint(c.Params("id"), 10, 64)
	p := new(requests.UpdateRedeemForm)
	if err := c.BodyParser(p); err != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error(),
			Data:    []models.Redeem{},
		}
		return c.Status(500).JSON(response)
	}
	v := validate.Struct(p)
	if !v.Validate() {
		response := RedeemResponse{
			Success: false,
			Message: v.Errors.One(),
			Data:    []models.Redeem{},
		}
		return c.Status(422).JSON(response)
	}
	updateRedeem := models.Redeem{
		ID:     uint(id),
		Status: p.Status,
	}
	err := updateRedeem.UpdateRedeemStatus(1)
	if err != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error(),
			Data:    []models.Redeem{},
		}
		return c.Status(400).JSON(response)
	}
	response := RedeemResponse{
		Success: true,
		Message: "Update Status Redeem Success!",
		Data:    []models.Redeem{},
	}
	return c.Status(200).JSON(response)
}
