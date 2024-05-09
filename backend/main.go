package main

import (
	"InHouseHub/database"
	"InHouseHub/mqtt"
	"InHouseHub/server"

	"github.com/joho/godotenv"
)

func main() {
	// Load the environment variables
	err := godotenv.Load()
	if err != nil {
		panic("Error loading .env file")
	}

	// Create a channel for broadcasting MQTT messages
	mqttBroadcast := make(chan mqtt.Message)

	// Start the database
	db := database.StartDatabase()

	// Start the MQTT client
	mqtt.StartMQTT(mqttBroadcast)

	// Start the server
	server.StartServer(db, mqttBroadcast)
}
