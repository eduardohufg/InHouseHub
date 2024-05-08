package main

import (
	"InHouseHub/internal"
)

func main() {
	internal.StartMQTT()
	internal.StartServer()
}
