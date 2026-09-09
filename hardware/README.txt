EXACT IKS SMART IRRIGATION WOKWI SETUP

Use diagram.json and main.py together.

Connections:
DHT22 VCC -> ESP32 3V3
DHT22 SDA -> ESP32 GPIO4
DHT22 NC -> leave completely unconnected
DHT22 GND -> ESP32 GND

Potentiometer:
VCC -> ESP32 3V3
SIG -> ESP32 GPIO34
GND -> ESP32 GND

Red LED:
GPIO26 -> 220 ohm -> LED anode
LED cathode -> GND

Green LED:
GPIO27 -> 220 ohm -> LED anode
LED cathode -> GND

IMPORTANT:
Do not connect the DHT22 NC pin.
Do not add another resistor to the DHT22 in this Wokwi version.
The Python program enables the ESP32 internal pull-up on GPIO4.

The potentiometer is only the Wokwi simulator for the real capacitive
soil-moisture sensor's analog output.

For the physical DHT11 later, use:
dht_sensor = dht.DHT11(Pin(4, Pin.IN, Pin.PULL_UP))
