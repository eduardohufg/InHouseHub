import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const Mosquitto1 = () => {
    const [message, setMessage] = useState("");  // Estado para almacenar el mensaje recibido

    useEffect(() => {
        const options = {
            // Clean session
            clean: true,
            connectTimeout: 4000,
            // Authentication
            clientId: 'emqx_test',
          };
        const client = mqtt.connect('ws://localhost:9001/mqtt');

        client.on("connect", () => {
            console.log("Connected to MQTT broker");
            client.subscribe("presence", (err) => {
    
            });
        });

        client.on("message", (topic, msg) => {
            console.log("Received message:", msg.toString());
            setMessage(msg.toString());  // Actualizar el estado con el mensaje recibido
        });

        client.on("error", (error) => {
            console.error("Connection error:", error);
        });

        return () => {
            console.log("Disconnecting MQTT client");
            client.end();
        };
    }, []);

    return (
        <div>
            <p>MQTT Message: {message}</p> 
        </div>
    );
};

export default Mosquitto1;
