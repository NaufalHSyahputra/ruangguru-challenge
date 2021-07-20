package client

import (
	"github.com/gofiber/fiber/v2"

	"rg_backend/app/models"
	"rg_backend/app/requests"

	"github.com/gookit/validate"
)

type RedeemResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func SaveUserData(c *fiber.Ctx) error {
	p := new(requests.RedeemForm)
	if err := c.BodyParser(p); err != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error(),
		}
		return c.Status(500).JSON(response)
	}
	v := validate.Struct(p)
	if !v.Validate() {
		response := RedeemResponse{
			Success: false,
			Message: v.Errors.One(),
		}
		return c.Status(422).JSON(response)
	}
	newRedeem := models.Redeem{
		CustId:            p.CustId,
		CustName:          p.CustName,
		CustAddress:       p.CustAddress,
		CustContactPerson: p.CustContactPerson,
		Prize:             p.Prize,
		RedeemLogs: []*models.RedeemLog{{
			Action:    "insert",
			OldStatus: "",
			NewStatus: "created",
		}},
	}
	count := newRedeem.CheckRedeemExistByCustId()
	if count > 0 {
		response := RedeemResponse{
			Success: false,
			Message: "You already claimed it!",
		}
		return c.Status(400).JSON(response)
	}

	err := newRedeem.CreateRedeem()
	if err != nil {
		response := RedeemResponse{
			Success: false,
			Message: err.Error(),
		}
		return c.Status(400).JSON(response)
	}
	response := RedeemResponse{
		Success: true,
		Message: "Redeem Prize Success!",
	}
	return c.Status(201).JSON(response)
}
