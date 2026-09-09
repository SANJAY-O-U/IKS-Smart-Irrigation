/* ================================================================
   IKS Smart Water Advisor - ESP32 firmware
   Reads capacitive soil moisture + DHT11, decides LED state, and
   POSTs a JSON reading to the Node.js/Express backend over Wi-Fi.
   ================================================================ */

#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

// -----------------------------------------------------------------
// CONFIGURATION - fill these in for your own network / server.
// Do NOT commit real credentials to a public repository.
// -----------------------------------------------------------------
const char* WIFI_SSID     = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// Use your computer's LAN IP (not "localhost") since the ESP32 is a
// separate device on the network, e.g. "http://192.168.1.42:5000/api/sensor/data"
const char* SERVER_URL = "http://192.168.1.100:5000/api/sensor/data";

// -----------------------------------------------------------------
// PIN CONFIGURATION
// -----------------------------------------------------------------
#define SOIL_PIN   34   // Capacitive soil moisture sensor AOUT
#define DHT_PIN    4    // DHT11 DATA
#define RED_LED    26
#define GREEN_LED  27

#define DHTTYPE DHT11
DHT dht(DHT_PIN, DHTTYPE);

// -----------------------------------------------------------------
// SOIL SENSOR CALIBRATION
// Every capacitive sensor reads slightly differently. Calibrate by:
//   1. Uploading a small test sketch that just prints analogRead(SOIL_PIN)
//   2. Note the raw ADC value with the sensor fully in AIR (dry)   -> DRY_VALUE
//   3. Note the raw ADC value with the sensor fully in WATER (wet) -> WET_VALUE
// These two constants are the only thing you need to change per sensor.
// -----------------------------------------------------------------
const int DRY_VALUE = 3000;  // raw ADC reading in dry air (adjust after calibration)
const int WET_VALUE = 1200;  // raw ADC reading fully submerged in water (adjust after calibration)

// -----------------------------------------------------------------
// TIMING
// -----------------------------------------------------------------
const unsigned long SEND_INTERVAL_MS = 5000; // send a reading every 5 seconds
unsigned long lastSendTime = 0;

void setup() {
  Serial.begin(115200);
  delay(500);

  pinMode(RED_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);
  digitalWrite(RED_LED, LOW);
  digitalWrite(GREEN_LED, LOW);

  dht.begin();

  connectToWiFi();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Wi-Fi disconnected, attempting to reconnect...");
    connectToWiFi();
  }

  if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
    lastSendTime = millis();
    takeReadingAndSend();
  }
}

void connectToWiFi() {
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print("Wi-Fi connected. IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("Wi-Fi connection failed. Will retry in main loop.");
  }
}

int readSoilMoisturePercent() {
  int raw = analogRead(SOIL_PIN);

  // Map raw ADC value to 0-100%, clamped to valid range.
  // Capacitive sensors read a LOWER raw value when wet, so the
  // mapping is inverted relative to a plain linear map().
  int percent = map(raw, DRY_VALUE, WET_VALUE, 0, 100);
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;

  Serial.print("Soil raw ADC: ");
  Serial.print(raw);
  Serial.print("  ->  Moisture: ");
  Serial.print(percent);
  Serial.println("%");

  return percent;
}

void updateLeds(int soilMoisture) {
  if (soilMoisture < 30) {
    digitalWrite(RED_LED, HIGH);
    digitalWrite(GREEN_LED, LOW);
  } else if (soilMoisture <= 60) {
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, LOW);
  } else {
    digitalWrite(RED_LED, LOW);
    digitalWrite(GREEN_LED, HIGH);
  }
}

void takeReadingAndSend() {
  int soilMoisture = readSoilMoisturePercent();

  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();

  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("DHT11 read failed, skipping this cycle.");
    return;
  }

  updateLeds(soilMoisture);

  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.print(" C   Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");

  sendReadingToServer(soilMoisture, temperature, humidity);
}

void sendReadingToServer(int soilMoisture, float temperature, float humidity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Cannot send: Wi-Fi not connected.");
    return;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");

  String payload = "{";
  payload += "\"soil_moisture\":" + String(soilMoisture) + ",";
  payload += "\"temperature\":" + String(temperature, 1) + ",";
  payload += "\"humidity\":" + String(humidity, 1);
  payload += "}";

  Serial.print("Sending payload: ");
  Serial.println(payload);

  int httpResponseCode = http.POST(payload);

  if (httpResponseCode > 0) {
    Serial.print("Server response code: ");
    Serial.println(httpResponseCode);
    Serial.println(http.getString());
  } else {
    Serial.print("HTTP POST failed, error: ");
    Serial.println(http.errorToString(httpResponseCode));
  }

  http.end();
}
