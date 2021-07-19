package main

import (
	"fmt"
	"log"
	"os"
	"rg_backend/config"
	"rg_backend/database"
	"rg_backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	//env
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	//Database
	config.NewDB()
	db := config.DB
	// sqlDB := db.DB()
	database.InitMigration(db)
	//Fiber
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	routes.ClientRoutes(app)
	routes.AuthRoutes(app)
	app.Listen(fmt.Sprintf(":%v", os.Getenv("APP_PORT")))
}
