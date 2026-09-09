"""
IKS Smart Irrigation System - Stage 1
ESP32 + DHT22 (simulates DHT11) + Potentiometer (simulates capacitive soil sensor)
Red/Green LED irrigation-decision indicators.
 
MicroPython / Wokwi simulation only. No Wi-Fi, no MQTT, no pump yet.
"""
 
import machine
import time
import dht
 
# ---------------------------------------------------------------------------
# PIN CONFIGURATION
# ---------------------------------------------------------------------------
SOIL_ADC_PIN   = 34   # Potentiometer SIG (simulated capacitive soil sensor)
DHT_DATA_PIN   = 4    # DHT22 DATA/SDA
RED_LED_PIN    = 26   # DRY / irrigation needed
GREEN_LED_PIN  = 27   # Moisture OK
 
MOISTURE_THRESHOLD = 35   # percent
 
# ---------------------------------------------------------------------------
# SOIL MOISTURE (ADC) SETUP
# ---------------------------------------------------------------------------
soil_adc = machine.ADC(machine.Pin(SOIL_ADC_PIN))
soil_adc.atten(machine.ADC.ATTN_11DB)   # allows full 0-3.3V range -> 0-4095 raw
 
# ---------------------------------------------------------------------------
# DHT22 SETUP
# GPIO4 is configured with the ESP32 internal pull-up BEFORE the dht.DHT22
# driver takes ownership of the pin. This mirrors the pull-up a real DHT11/22
# needs on its data line and avoids ETIMEDOUT errors caused by a floating pin.
# ---------------------------------------------------------------------------
dht_pin = machine.Pin(DHT_DATA_PIN, machine.Pin.IN, machine.Pin.PULL_UP)
dht_sensor = dht.DHT22(dht_pin)
 
# ---------------------------------------------------------------------------
# LED SETUP
# ---------------------------------------------------------------------------
red_led = machine.Pin(RED_LED_PIN, machine.Pin.OUT)
green_led = machine.Pin(GREEN_LED_PIN, machine.Pin.OUT)
red_led.value(0)
green_led.value(0)
 
 
def read_soil_moisture():
    """Read the potentiometer (simulated soil sensor) and convert to %."""
    raw = soil_adc.read()                    # 0 - 4095
    moisture_percent = int((raw / 4095) * 100)
    return raw, moisture_percent
 
 
def read_dht():
    """Read temperature/humidity from the DHT22. Returns (temp, hum) or (None, None)."""
    try:
        dht_sensor.measure()
        temperature = dht_sensor.temperature()
        humidity = dht_sensor.humidity()
        return temperature, humidity
    except OSError as e:
        print("DHT ERROR:", e)
        return None, None
 
 
def update_leds_and_status(moisture_percent):
    """Drive LEDs based on the moisture threshold and return (status, action)."""
    if moisture_percent < MOISTURE_THRESHOLD:
        red_led.value(1)
        green_led.value(0)
        status = "DRY - IRRIGATION NEEDED"
        action = "WATERING SHOULD START"
    else:
        red_led.value(0)
        green_led.value(1)
        status = "MOISTURE OK"
        action = "WATERING NOT REQUIRED"
    return status, action
 
 
def print_report(soil_raw, moisture_percent, temperature, humidity, status, action):
    print("------------------------------------------")
    print("Soil ADC       : {}".format(soil_raw))
    print("Soil Moisture  : {}%".format(moisture_percent))
    if temperature is not None:
        print("Temperature    : {} C".format(temperature))
    else:
        print("Temperature    : N/A")
    if humidity is not None:
        print("Humidity       : {}%".format(humidity))
    else:
        print("Humidity       : N/A")
    print("Status         : {}".format(status))
    print("Action         : {}".format(action))
    print("------------------------------------------")
 
 
def main():
    print("IKS Smart Irrigation System - Starting...")
    # Startup delay before the very first DHT22 reading, so the sensor and
    # simulation have time to stabilize (also avoids early ETIMEDOUT errors).
    time.sleep(2)
 
    while True:
        soil_raw, moisture_percent = read_soil_moisture()
        temperature, humidity = read_dht()
        status, action = update_leds_and_status(moisture_percent)
        print_report(soil_raw, moisture_percent, temperature, humidity, status, action)
        time.sleep(3)
 
 
main()