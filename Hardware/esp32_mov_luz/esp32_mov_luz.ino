#include <WiFi.h>
#include <PubSubClient.h>

// Configuración de la red WiFi
const char* ssid = "mamax";
const char* password = "121212aaa";

// Configuración del servidor MQTT
const char* mqtt_server = "192.168.132.120";
const int mqtt_port = 1883;

WiFiClient espClient;
PubSubClient client(espClient);

// Configuración del pin del LED
const int ledPin = 15;
bool ledState = false;  // Estado inicial del LED

// Conexión a la red WiFi
void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

// Función de callback que se ejecuta cuando llegan mensajes al tópico suscrito
void callback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;

  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }
  Serial.println(messageTemp);

  if (String(topic) == "respuesta") {
    if (messageTemp.toInt() == 1) {
      ledState = !ledState;  // Cambia el estado del LED
      digitalWrite(ledPin, ledState);
      Serial.println(ledState);
    }
  }
}

// Conexión al servidor MQTT
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("ESP32Client")) {
      Serial.println("connected");
      client.subscribe("respuesta");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}
