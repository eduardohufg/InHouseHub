#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_AHTX0.h>
#include <Adafruit_BMP085_U.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Credenciales de la red Wi-Fi
const char* ssid = "mamax";
const char* password = "121212aaa";

// Configuración del servidor MQTT
const char* mqtt_server = "192.168.132.120";
const int mqtt_port = 1883;

// Pin para el sensor MQ-135
const int mq135Pin = 4;

// Cliente WiFi y MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Instancias de los sensores: AHT10 y BMP180 respectivamente
Adafruit_AHTX0 aht;
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

void setup() {
  Serial.begin(115200);
  delay(20000); // Esperar a que el MQ-135 se caliente durante 20 segundos
  setupWiFi();
  client.setServer(mqtt_server, mqtt_port);

  Serial.println("Inicialización de sensores: AHT10 & BMP180");

  if (!aht.begin()) {
    Serial.println("Error al iniciar el sensor AHT10!");
    while (1) delay(10);
  }
  Serial.println("AHT10 inicializado");

  if (!bmp.begin()) {
    Serial.println("Error al iniciar el sensor BMP180");
    while (1);
  }
  Serial.println("BMP180 inicializado");

  

}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  sensors_event_t humidity, temp, pressure;

  aht.getEvent(&humidity, &temp);
  bmp.getEvent(&pressure);
  int airQuality = analogRead(mq135Pin);  // Leer el valor del MQ-135

  // Convertir los valores a cadenas
  char tempStr[8];
  dtostrf(temp.temperature, 1, 2, tempStr);
  char humStr[8];
  dtostrf(humidity.relative_humidity, 1, 2, humStr);
  char presStr[8];
  dtostrf(pressure.pressure, 1, 2, presStr);
  char airQualStr[8];
  itoa(airQuality, airQualStr, 10);

  // Publicar en los tópicos MQTT
  client.publish("temperature", tempStr);
  Serial.print("Temperatura: ");
  Serial.print(tempStr);
  Serial.println(" grados C");

  client.publish("humidity", humStr);
  Serial.print("Humedad: ");
  Serial.print(humStr);
  Serial.println(" %");

  if (pressure.pressure) {
    client.publish("pressure", presStr);
    Serial.print("Presion: ");
    Serial.print(presStr);
    Serial.println(" hPa");
  }

  client.publish("airQuality", airQualStr);
  Serial.print("Aire: ");
  Serial.print(airQualStr);
  Serial.println(" ppm");

  delay(2000);  // Espera de 2 segundos entre lecturas
}

void setupWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi conectado");
  Serial.println("Dirección IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Intentando conexión MQTT...");
    if (client.connect("ESP32Client")) {
      Serial.println("conectado");
    } else {
      Serial.print("fallo, rc=");
      Serial.print(client.state());
      Serial.println(" intentar de nuevo en 5 segundos");
      delay(5000);
    }
  }
}
