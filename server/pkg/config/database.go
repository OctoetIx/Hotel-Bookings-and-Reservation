package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"github.com/OctoetIx/Hotel-Bookings-and-Reservation/pkg/models"
)

var DB *gorm.DB

func ConnectDatabase() {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	name := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Step 1: Connect to MySQL without specifying a database
	dsnRoot := fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port,
	)
	sqlDB, err := sql.Open("mysql", dsnRoot)
	if err != nil {
		log.Fatal("❌ Failed to connect to MySQL server:", err)
	}
	defer sqlDB.Close()

	// Step 2: Check if database exists
	var exists string
	err = sqlDB.QueryRow("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", name).Scan(&exists)
	if err != nil && err != sql.ErrNoRows {
		log.Fatal("❌ Failed to check database existence:", err)
	}

	if exists == "" {
		// Database does not exist → create it
		_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE %s CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;", name))
		if err != nil {
			log.Fatal("❌ Failed to create database:", err)
		}
		log.Printf("✅ Database '%s' did not exist and was created automatically\n", name)
	} else {
		log.Printf("✅ Database '%s' already exists, connecting...\n", name)
	}

	// Step 3: Connect with GORM to the target database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		user, password, host, port, name,
	)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Failed to connect database:", err)
	}
	DB = db
	log.Println("✅ Connected to database successfully")

	// Step 4: Run migrations
	err = DB.AutoMigrate(
		&models.User{},
		&models.Room{},
		&models.Booking{},
		&models.Review{},
	)
	if err != nil {
		log.Fatal("❌ Migration failed:", err)
	}
	log.Println("✅ Database migrated successfully")
}
