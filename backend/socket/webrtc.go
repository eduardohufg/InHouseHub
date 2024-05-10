package socket

import (
	"InHouseHub/pkg"
	"log"
	"strings"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

var sessions = make(map[string]*Session)

type Client struct {
	Conn *websocket.Conn
}

type Session struct {
	Clients [2]*Client
	Count   int
}

func StartWebRTC(app *fiber.App) {
	app.Get("/webrtc", websocket.New(func(c *websocket.Conn) {
		subprotocols := strings.Split(c.Headers("Sec-Websocket-Protocol"), ",")

		for i, subprotocol := range subprotocols {
			subprotocols[i] = strings.TrimSpace(subprotocol)
		}

		if len(subprotocols) != 2 || subprotocols[0] != "Authorization" {
			c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Invalid subprotocol"))
			c.Close()
			return
		}

		id, err := pkg.ParseToken(subprotocols[1])
		if err != nil {
			c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.ClosePolicyViolation, "Invalid token"))
			c.Close()
			return
		}

		session, ok := sessions[id]
		if !ok {
			session = &Session{
				Clients: [2]*Client{nil, nil},
				Count:   0,
			}
			sessions[id] = session
		}

		if session.Count >= 2 {
			log.Println("More than two devices attempted to connect with the same ID")
			c.Close()
			return
		}

		client := &Client{Conn: c}
		index := session.Count
		session.Clients[index] = client
		session.Count++

		if session.Count == 2 {
			log.Println("Two clients connected")

			if session.Clients[0] != nil && session.Clients[0].Conn != nil {
				if err := session.Clients[0].Conn.WriteMessage(websocket.TextMessage, []byte(`{"type":"init"}`)); err != nil {
					log.Println("Error writing message:", err)
				}
			}
		}

		defer func() {
			session.Count--
			session.Clients[index] = nil
			if session.Count == 0 {
				delete(sessions, id)
			}
			if err := c.Close(); err != nil {
				log.Println("Error closing connection:", err)
			}
		}()

		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				log.Println("Error reading websocket message:", err)
				break
			}

			otherIndex := 1 - index
			if otherClient := session.Clients[otherIndex]; otherClient != nil && otherClient.Conn != nil {
				log.Println("Sending message to other client")

				if err := otherClient.Conn.WriteMessage(websocket.TextMessage, msg); err != nil {
					log.Println("Error writing message:", err)
				}
			}
		}
	}, websocket.Config{
		Subprotocols: []string{"Authorization"},
	}))
}
