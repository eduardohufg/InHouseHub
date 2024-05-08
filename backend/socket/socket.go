package socket

import (
	"log"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func SetupSocket(app *fiber.App) {
	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				return
			}

			log.Println(string(msg))
			c.WriteMessage(websocket.TextMessage, msg)
		}
	}))
}
