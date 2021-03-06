package helpers

import (
	"os"
	"rg_backend/app/models"
	"rg_backend/config"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt"
)

var jwtKey = []byte(os.Getenv("JWT_SECRET"))

// GenerateTokens returns the access and refresh tokens
func GenerateTokens(id uint) (string, string) {
	claim, accessToken := GenerateAccessClaims(id)
	refreshToken := GenerateRefreshClaims(claim)

	return accessToken, refreshToken
}

// GenerateAccessClaims returns a claim and a acess_token string
func GenerateAccessClaims(id uint) (*models.Claims, string) {

	t := time.Now()
	claim := &models.Claims{
		StandardClaims: jwt.StandardClaims{
			Issuer:    strconv.FormatUint(uint64(id), 10),
			ExpiresAt: t.Add(1440 * time.Minute).Unix(),
			Subject:   "access_token",
			IssuedAt:  t.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		panic(err)
	}

	return claim, tokenString
}

// GenerateRefreshClaims returns refresh_token
func GenerateRefreshClaims(cl *models.Claims) string {
	db := config.NewSQLiteDB()

	result := db.Where(&models.Claims{
		StandardClaims: jwt.StandardClaims{
			Issuer: cl.Issuer,
		},
	}).Find(&models.Claims{})

	// checking the number of refresh tokens stored.
	// If the number is higher than 3, remove all the refresh tokens and leave only new one.
	if result.RowsAffected > 3 {
		db.Where(&models.Claims{
			StandardClaims: jwt.StandardClaims{Issuer: cl.Issuer},
		}).Delete(&models.Claims{})
	}

	t := time.Now()
	refreshClaim := &models.Claims{
		StandardClaims: jwt.StandardClaims{
			Issuer:    cl.Issuer,
			ExpiresAt: t.Add(30 * 24 * time.Hour).Unix(),
			Subject:   "refresh_token",
			IssuedAt:  t.Unix(),
		},
	}

	// create a claim on DB
	db.Create(&refreshClaim)

	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaim)
	refreshTokenString, err := refreshToken.SignedString(jwtKey)
	if err != nil {
		panic(err)
	}

	return refreshTokenString
}

// SecureAuth returns a middleware which secures all the private routes
func SecureAuth() func(*fiber.Ctx) error {
	return func(c *fiber.Ctx) error {
		authorization := c.Get("Authorization")
		if len(authorization) <= 0 {
			return c.SendStatus(fiber.StatusUnauthorized)
		}
		splitToken := strings.Split(authorization, "Bearer ")
		accessToken := splitToken[1]
		claims := new(models.Claims)
		token, err := jwt.ParseWithClaims(accessToken, claims,
			func(token *jwt.Token) (interface{}, error) {
				return jwtKey, nil
			})
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":   true,
				"general": err.Error(),
			})
		}
		if token.Valid {
			if claims.ExpiresAt < time.Now().Unix() {
				return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
					"error":   true,
					"general": "Token Expired",
				})
			}
		} else if ve, ok := err.(*jwt.ValidationError); ok {
			if ve.Errors&jwt.ValidationErrorMalformed != 0 {
				// this is not even a token, we should delete the cookies here
				c.ClearCookie("access_token", "refresh_token")
				return c.SendStatus(fiber.StatusForbidden)
			} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
				// Token is either expired or not active yet
				return c.SendStatus(fiber.StatusUnauthorized)
			} else {
				// cannot handle this token
				c.ClearCookie("access_token", "refresh_token")
				return c.SendStatus(fiber.StatusForbidden)
			}
		}

		c.Locals("id", claims.Issuer)
		return c.Next()
	}
}

// GetAuthCookies sends two cookies of type access_token and refresh_token
func GetAuthCookies(accessToken, refreshToken string) (*fiber.Cookie, *fiber.Cookie) {
	accessCookie := &fiber.Cookie{
		Name:     "access_token",
		Value:    accessToken,
		Expires:  time.Now().Add(24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
	}

	refreshCookie := &fiber.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		Expires:  time.Now().Add(10 * 24 * time.Hour),
		HTTPOnly: true,
		Secure:   true,
	}

	return accessCookie, refreshCookie
}
