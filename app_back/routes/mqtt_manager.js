const router = require('express').Router();
const mqtt = require('mqtt');

router.get('/', (req, res) => {
    // Conectar al broker MQTT
    const client = mqtt.connect('mqtt://localhost:1883');

    client.on("connect", () => {
        console.log("Connected to MQTT broker");
        client.subscribe("presence", (err) => {
            if (!err) {
                client.publish("presence", "Hello max");
            } else {
                res.status(500).send("Failed to subscribe");
            }
        });
    });

    client.on("message", (topic, msg) => {
        console.log("Received message:", msg.toString());
        // Enviar la respuesta y cerrar la conexión
        res.send(msg.toString());
        client.end();
    });

    client.on("error", (error) => {
        console.error("Connection error:", error);
        res.status(500).send("MQTT connection error");
        client.end();
    });

    // Timeout para cerrar la conexión si no se recibe ningún mensaje
    setTimeout(() => {
        if (!res.headersSent) {
            res.send("No message received");
            client.end();
        }
    }, 5000);  // Espera 5 segundos por un mensaje
});

module.exports = router;
