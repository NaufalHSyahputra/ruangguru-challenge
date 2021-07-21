package main

import (
	"fmt"
	"log"
	"os"
	"rg_backend/app/helpers"
	"rg_backend/config"
	"rg_backend/database"
	"rg_backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	//env
	// err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	//Database
	db := config.NewSQLiteDB()
	// db, _ := gorm.Open(sqlite.Open("gorm.db"), &gorm.Config{})

	// sqlDB := db.DB()
	database.InitMigration(db)
	//Fiber
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowCredentials: true,
	}))
	routes.ClientRoutes(app)
	routes.AuthRoutes(app)
	// JWT Middleware
	app.Use(helpers.SecureAuth())
	routes.UserRoutes(app)
	routes.AdminRoutes(app)
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}
	log.Fatal(app.Listen(fmt.Sprintf(":%v", os.Getenv("APP_PORT"))))
}
