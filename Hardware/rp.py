from machine import UART, Pin
import dht
import bmp280
import time

# Configuración del sensor DHT22
sensor_dht = dht.DHT22(Pin(15))

# Configuración del sensor BMP280
i2c = machine.I2C(0, scl=machine.Pin(1), sda=machine.Pin(0))
sensor_bmp = bmp280.BMP280(i2c)

# Configuración de UART
uart = UART(0, baudrate=115200)

while True:
    try:
        # Leer sensor DHT22
        sensor_dht.measure()
        temp = sensor_dht.temperature()  # Temperatura en grados Celsius
        hum = sensor_dht.humidity()      # Humedad en porcentaje

        # Leer sensor BMP280
        pres = sensor_bmp.pressure        # Presión atmosférica

        # Preparar el mensaje para enviar
        mensaje = f"{temp:.2f},{hum:.2f},{pres:.2f}"
        
        # Enviar datos por UART
        uart.write(mensaje + '\n')
        
        # Espera antes de la próxima lectura
        time.sleep(2)
    
    except Exception as e:
        print('Error leyendo los sensores:', str(e))
