package auth

import (
	"rg_backend/app/helpers"
	"rg_backend/app/models"
	"rg_backend/app/requests"
	"rg_backend/config"

	"github.com/gofiber/fiber/v2"
	"github.com/gookit/validate"
	"golang.org/x/crypto/bcrypt"
)

type UserData struct {
	ID    uint   `gorm:"primaryKey"`
	Email string `json:"email"`
	Name  string `json:"name"`
}

func LoginUser(c *fiber.Ctx) error {
	db := config.NewSQLiteDB()
	p := new(requests.LoginForm)
	if err := c.BodyParser(p); err != nil {
		return err
	}
	v := validate.Struct(p)
	if !v.Validate() {
		return c.JSON(fiber.Map{
			"message": v.Errors.One(),
		})
	}
	u := new(models.User)
	u2 := new(UserData)
	db.Model(models.User{}).Where("email = ?", p.Email).First(&u2)
	if res := db.Where("email = ?", p.Email).First(&u); res.RowsAffected <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Invalid Email!",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(p.Password)); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "Password is incorrect!",
		})
	}

	accessToken, refreshToken := helpers.GenerateTokens(u.ID)
	accessCookie, _ := helpers.GetAuthCookies(accessToken, refreshToken)

	c.Cookie(accessCookie)
	// c.Cookie(refreshCookie)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success":      true,
		"message":      "Login Success",
		"access_token": accessToken,
		"user":         u2,
		// "refresh_token": refreshToken,
	})
}

func GetUser(c *fiber.Ctx) error {
	id := c.Locals("id")
	db := config.NewSQLiteDB()

	u := new(UserData)
	if res := db.Model(models.User{}).First(&u, id); res.RowsAffected <= 0 {
		return c.JSON(fiber.Map{"error": true, "general": "Cannot find the User"})
	}

	return c.JSON(u)
}
