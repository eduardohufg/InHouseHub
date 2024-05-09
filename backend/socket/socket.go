package socket

import (
	"InHouseHub/mqtt"
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

var clients = make(map[*websocket.Conn]interface{})
var register = make(chan *websocket.Conn)
var unregister = make(chan *websocket.Conn)

func SetupSocket(app *fiber.App, mqttBroadcast <-chan mqtt.Message) {
	app.Use(func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return c.SendStatus(fiber.StatusUpgradeRequired)
	})

	go func() {
		for {
			select {
			case connection := <-register:
				clients[connection] = nil
				log.Println("Client connected")
			case message := <-mqttBroadcast:
				for connection := range clients {
					connection.WriteJSON(message)
				}
			case connection := <-unregister:
				delete(clients, connection)
				log.Println("Client disconnected")
			}
		}
	}()

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		defer func() {
			unregister <- c
			c.Close()
		}()

		register <- c

		for {
			messageType, msg, err := c.ReadMessage()
			if err != nil {
				break
			}

			log.Println(string(msg))
			c.WriteMessage(messageType, msg)
		}
	}))
}
