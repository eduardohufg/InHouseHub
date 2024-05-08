package mqtt

import (
	"fmt"
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"

	"InHouseHub/config"
)

const Topic = "test"

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	log.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	log.Println("Connected to MQTT broker")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	log.Printf("Connect lost: %v", err)
}

func StartMQTT() {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(config.Get("MQTT_BROKER"))
	opts.SetClientID(config.Get("MQTT_CLIENT_ID"))
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	client := mqtt.NewClient(opts)
	if token := client.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}

	token := client.Subscribe(Topic, 0, nil)
	if token.Wait() && token.Error() != nil {
		fmt.Println("Error subscribing to topic:", Topic, token.Error())
		return
	}

	log.Println("Connected to MQTT broker:", config.Get("MQTT_BROKER"))
	log.Println("Subscribed to topic:", Topic)
}
