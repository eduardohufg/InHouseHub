import serial
import time

# Configuración de UART
ser = serial.Serial('/dev/serial0', 115200, timeout=1)

while True:
    if ser.in_waiting > 0:
        linea = ser.readline().decode('utf-8').strip()
        if linea:
            try:
                # Descomponer los datos recibidos
                datos = linea.split(',')
                temp = float(datos[0])
                hum = float(datos[1])
                pres = float(datos[2])

                # Mostrar los datos
                print(f"Temperatura: {temp} C")
                print(f"Humedad: {hum} %")
                print(f"Presión: {pres} Pa")
            except ValueError:
                print("Error al procesar los datos:", linea)
    time.sleep(1)
