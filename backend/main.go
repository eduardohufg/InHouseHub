package main

import (
	"fmt"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const BROKER = "tcp://localhost:1883"
const TOPIC = "test"
const CLIENT_ID = "backend"

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	fmt.Printf("Connect lost: %v", err)
}

func main() {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(BROKER)
	opts.SetClientID(CLIENT_ID)
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	token := client.Subscribe(TOPIC, 0, nil)
	if token.Wait() && token.Error() != nil {
		fmt.Println("Error subscribing to topic: ", TOPIC, token.Error())
		return
	}

	token = client.Publish(TOPIC, 0, false, "Hello World")
	if token.Wait() && token.Error() != nil {
		fmt.Println("Error publishing message: ", token.Error())
		return
	}

	time.Sleep(60 * time.Second)
	client.Disconnect(250)
}
