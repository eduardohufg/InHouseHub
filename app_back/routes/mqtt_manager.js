const router = require('express').Router();
const mqtt = require('mqtt');

let lasstMessage = "No data received";
let lasstMessage2 = "No data received";
let lasstMessage3 = "No data received";

router.get('/', (req, res) => {
    // Conectar al broker MQTT
    const client = mqtt.connect('mqtt://localhost:1883');
    const client2 = mqtt.connect('mqtt://localhost:1883');
    const client3 = mqtt.connect('mqtt://localhost:1883');

    client.on("connect", () => {
        console.log("Connected to MQTT broker");
        client.subscribe("presence", (err) => {
            if (!err) {
                console.log("Subscribed to topic 'presence'");
            } else {
                res.status(500).send("Failed to subscribe");
            }
        });
    });

    client2.on("connect", () => {
        console.log("Connected to MQTT broker2");
        client2.subscribe("prueba", (err) => {
            if (!err) {
                console.log("Subscribed to topic 'prueba'");
            } else {
                res.status(500).send("Failed to subscribe");
            }
        });
    });

    client3.on("connect", () => {
        console.log("Connected to MQTT broker3");
        client3.subscribe("prueba2", (err) => {
            if (!err) {
                console.log("Subscribed to topic 'prueba2'");
            } else {
                res.status(500).send("Failed to subscribe");
            }
        });
    });

    client2.on("message", (topic, msg) => {
        console.log("Received message:", msg.toString());
        lasstMessage2 = msg.toString();
        client2.end();
    });


    client.on("message", (topic, msg) => {
        console.log("Received message:", msg.toString());
        // Enviar la respuesta y cerrar la conexión
        lasstMessage = msg.toString();
        client.end();
    });

    client3.on("message", (topic, msg) => {
        console.log("Received message:", msg.toString());
        // Enviar la respuesta y cerrar la conexión
        lasstMessage3 = msg.toString();
        client3.end();
    });

    client.on("error", (error) => {
        console.error("Connection error:", error);
        res.status(500).send("MQTT connection error");
        client.end();
    });

    client2.on("error", (error) => {
        console.error("Connection error:", error);
        res.status(500).send("MQTT connection error");
        client2.end();
    });

    client3.on("error", (error) => {
        console.error("Connection error:", error);
        res.status(500).send("MQTT connection error");
        client3.end();
    });

    res.send(lasstMessage + " " + lasstMessage2 + " " + lasstMessage3);
    // Timeout para cerrar la conexión si no se recibe ningún mensaje
    setTimeout(() => {
        if (!res.headersSent) {
            res.send(lasstMessage + " " + lasstMessage2 + " " + lasstMessage3);
            client.end();
        }
    }, 5000); 
    
    // Espera 5 segundos por un mensaje
});

module.exports = router;
