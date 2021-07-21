package models

import (
	"database/sql"
	"rg_backend/config"
	"time"

	"gorm.io/gorm"
)

type Redeem struct {
	ID                uint         `gorm:"primaryKey"`
	CustId            string       `json:"cust_id"`
	CustName          string       `json:"cust_name"`
	CustAddress       string       `json:"cust_address"`
	CustContactPerson string       `json:"cust_cp"`
	Prize             string       `json:"prize"`
	Status            string       `json:"status" gorm:"default:created"`
	CreatedAt         time.Time    `json:"created_at"`
	UpdatedAt         time.Time    `json:"updated_at"`
	DeletedAt         sql.NullTime `json:"deleted_at"`
	RedeemLogs        []*RedeemLog `gorm:"foreignKey:redeem_id" json:"logs"`
}

type RedeemLog struct {
	ID        uint      `gorm:"primaryKey"`
	RedeemID  uint      `json:"redeem_id"`
	Action    string    `json:"action"`
	OldStatus string    `json:"old_status"`
	NewStatus string    `json:"new_status"`
	UserID    uint      `json:"user_id" gorm:"default:null"`
	CreatedAt time.Time `json:"created_at"`
	// Redeem    Redeem
	User User
}

func (redeem *Redeem) GetRedeem(args ...string) *gorm.DB {
	db := config.NewSQLiteDB()
	query := db.Model(redeem).Preload("RedeemLogs").Select(args)
	return query
}

func (redeem *Redeem) CheckRedeemExistByCustId() int64 {
	db := config.NewSQLiteDB()
	var result int64
	db.Model(redeem).Where("cust_id = ?", redeem.CustId).Count(&result)
	return result
}

//
func (redeem *Redeem) CreateRedeem() error {
	db := config.NewSQLiteDB()
	result := db.Create(&redeem)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (redeem *Redeem) UpdateRedeemStatus(userID uint) error {
	db := config.NewSQLiteDB()
	queryResult := Redeem{}
	resultQuery := db.Model(redeem).Select("redeems.status").Find(&queryResult, redeem.ID)
	if resultQuery.Error != nil {
		return resultQuery.Error
	}
	result := db.Model(&Redeem{}).Where("id", redeem.ID).Update("status", redeem.Status)
	if result.Error != nil {
		return result.Error
	}
	resultLog := db.Create(&RedeemLog{
		RedeemID:  redeem.ID,
		Action:    "update",
		OldStatus: queryResult.Status,
		NewStatus: redeem.Status,
		UserID:    userID,
	})
	if resultLog.Error != nil {
		return resultLog.Error
	}
	return nil
}
