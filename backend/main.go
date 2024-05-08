package main

import (
	"InHouseHub/internal"
)

func main() {
	// Start the database
	_ = internal.StartDatabase()

	// Start the MQTT client
	internal.StartMQTT()

	// Start the server
	internal.StartServer()
}
