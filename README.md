# InHouseHub

## Endpoints

- API: `http://localhost:8080/api`
- MQTT: `tcp://localhost:1883`
- SOCKET: `ws://localhost:8080/ws`

## Environment Variables

```bash
# backend/.env
DATABASE_URL = "mongodb://localhost:27017"
DATABASE_NAME = "InHouseHub"
MQTT_BROKER = "tcp://localhost:1883"
MQTT_CLIENT_ID = "backend"
SERVER_PORT = ":8080"
```