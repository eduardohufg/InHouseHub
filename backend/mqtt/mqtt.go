package mqtt

import (
	"log"

	mqtt "github.com/eclipse/paho.mqtt.golang"

	"InHouseHub/config"
)

var Topics = []string{"device/+/status"}

var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	log.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	log.Println("Connected to MQTT broker")

	for _, t := range Topics {
		if token := client.Subscribe(t, 0, nil); token.Wait() && token.Error() != nil {
			log.Printf("Error subscribing to topic: %s, error: %v\n", t, token.Error())
		} else {
			log.Printf("Subscribed to topic: %s\n", t)
		}
	}
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

	log.Println("Connected to MQTT broker:", config.Get("MQTT_BROKER"))
}
