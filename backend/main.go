package main

import (
	"InHouseHub/internal"
	"InHouseHub/internal/database"
)

func main() {
	// Start the database
	db := database.StartDatabase()

	// Start the MQTT client
	internal.StartMQTT()

	// Start the server
	internal.StartServer(db)
}
