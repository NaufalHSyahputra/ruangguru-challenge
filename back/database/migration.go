package database

import (
	"rg_backend/app/models"

	"gorm.io/gorm"
)

func InitMigration(db *gorm.DB) {
	db.AutoMigrate(&models.User{}, &models.Redeem{}, &models.RedeemLog{})
	InitSeeding(db)
}

func InitSeeding(db *gorm.DB) {
	var userCount int64
	db.Model(&models.User{}).Count(&userCount)
	if userCount == 0 {
		UserSeeder(db)
	}
}

func UserSeeder(db *gorm.DB) {
	user := []models.User{
		{
			Name:     "Naufal",
			Email:    "naufal@test.com",
			Password: "$2y$12$0pFrZPFPTAJWw85GgIWXD.fEkYIcdJ//RBsGzC2EqglArI6W/Ugu2", //password
		},
		{
			Name:     "Naufal2",
			Email:    "naufal2@test.com",
			Password: "$2y$12$0pFrZPFPTAJWw85GgIWXD.fEkYIcdJ//RBsGzC2EqglArI6W/Ugu2", //password
		},
	}
	db.Create(&user)
}
