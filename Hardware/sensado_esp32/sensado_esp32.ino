// Estación de sensado mediante un ESP32
// Eduardo Chávez Martín        A01799595
// Maximiliano De La Cruz Lima  A01798048

// Librerías
#include <Wire.h>               // Comunicación serial I2C
#include <Adafruit_Sensor.h>    // Dependencia para librerías Adafruit
#include <Adafruit_AHTX0.h>     // AHT10: temperatura y humedad
#include <Adafruit_BMP085_U.h>  // BMP180: presión atmosférica / barométricas

// Instancias de los sensores: AHT10 y BMP180 respectivamente
Adafruit_AHTX0 aht;
Adafruit_BMP085_Unified bmp = Adafruit_BMP085_Unified(10085);

void setup() {
  Serial.begin(115200);
  Serial.println("Inicialización de sensores: AHT10 & BMP180");

  if (!aht.begin()) {
    Serial.println("Error al iniciar el sensor AHT10!");
    while (1) delay(10);
  }
  Serial.println("AHT10 inicializado");

  if (!bmp.begin()) {
    Serial.println("Error al iniciar el sensor BMP180");
    while (1)
      ;
  }
  Serial.println("BMP180 inicializado");
}

void loop() {
  sensors_event_t humidity, temp, pressure;

  aht.getEvent(&humidity, &temp);
  bmp.getEvent(&pressure);

  Serial.println("Datos del sensor AHT10:");
  Serial.print("Temperatura: ");
  Serial.print(temp.temperature);
  Serial.println(" C");

  Serial.print("Humedad: ");
  Serial.print(humidity.relative_humidity);
  Serial.println(" %");

  Serial.println("Datos del sensor BMP180:");
  if (pressure.pressure) {
    Serial.print("Presion: ");
    Serial.print(pressure.pressure);
    Serial.println(" hPa");
  }

  delay(2000);  // Espera de 2 segundos entre lecturas
}
