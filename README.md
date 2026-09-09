# IKS Smart Water Advisor

**Traditional Indian Knowledge + IoT for Sustainable Irrigation**

A college project for **Indian Knowledge Systems (IKS)** that pairs traditional Indian
water-management principles with a real-time IoT sensing and decision-support system.

---

## 1. Project Overview

The ESP32 reads soil moisture (capacitive sensor) and temperature/humidity (DHT11), sends
the readings over Wi-Fi to a Node.js/Express REST API, which stores them in MySQL and runs a
simple, transparent **rule-based** recommendation. A React dashboard displays live readings,
a moisture gauge, trend charts, and a clear irrigation recommendation — with a built-in
**Demo Mode** so the project can be presented even without live hardware.

This is **not** an AI/ML project. Every decision is a plain if/else threshold that can be
explained in one sentence.

---

## 2. Features

- Live dashboard with auto-refresh (no page reload)
- Soil moisture gauge (red / yellow / green)
- Line chart of the last 10–20 readings (moisture, temperature, humidity)
- Rule-based irrigation recommendation with a plain-English explanation
- Demo Mode — simulated data for offline/hardware-free demonstrations
- Presentation Mode — projector-friendly, enlarged view for exhibitions
- History page with search, date filter, pagination and CSV export
- Graceful offline handling (server offline / ESP32 offline / no data)
- IKS Knowledge and Architecture pages for the academic write-up

---

## 3. Hardware

| Component | Qty |
|---|---|
| ESP32 DevKit | 1 |
| Capacitive Soil Moisture Sensor | 1 |
| DHT11 Temperature & Humidity Sensor | 1 |
| Red LED | 1 |
| Green LED | 1 |
| Breadboard | 1 |
| Jumper wires | as needed |
| 220Ω resistors | 2 |

**Wiring**

| Component | Pin | ESP32 |
|---|---|---|
| Soil sensor | VCC | 3.3V |
| Soil sensor | GND | GND |
| Soil sensor | AOUT | GPIO 34 |
| DHT11 | VCC | 3.3V |
| DHT11 | GND | GND |
| DHT11 | DATA | GPIO 4 |
| Red LED | anode (via 220Ω) | GPIO 26 |
| Green LED | anode (via 220Ω) | GPIO 27 |

---

## 4. Software Stack

- **Frontend:** React, Vite, React Router, Recharts, plain CSS3
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **IoT:** ESP32, Arduino IDE, HTTP REST, Wi-Fi

---

## 5. Architecture

```
FARM
  ↓
SOIL MOISTURE SENSOR + DHT11
  ↓
ESP32
  ↓
Wi-Fi
  ↓
NODE.JS + EXPRESS REST API
  ↓
MYSQL DATABASE
  ↓
REACT FRONTEND
  ↓
SMART IRRIGATION RECOMMENDATION
  ↓
USER DASHBOARD
```

---

## 6. Database Setup

1. Make sure MySQL is running locally.
2. Run the schema file:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `iks_smart_water_advisor` database, the `sensor_readings` table, and a
handful of demo rows so the dashboard/history pages have data on first run.

---

## 7. Backend Setup

```bash
cd server
npm install
cp .env.example .env
# edit .env with your own MySQL credentials
npm run dev
```

The API starts on `http://localhost:5000` by default. Check it with:

```bash
curl http://localhost:5000/api/health
```

---

## 8. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

Optional: create `client/.env` with `VITE_API_URL=http://localhost:5000/api` if your backend
runs somewhere other than `localhost:5000`.

---

## 9. ESP32 Setup

1. Open `esp32/iks_smart_water_advisor.ino` in the Arduino IDE.
2. Install the **DHT sensor library** (by Adafruit) and **Adafruit Unified Sensor** via
   Library Manager.
3. Select your ESP32 board under Tools → Board.
4. Edit the top of the file:
   - `WIFI_SSID`, `WIFI_PASSWORD` — your network credentials
   - `SERVER_URL` — your computer's **LAN IP**, not `localhost` (e.g.
     `http://192.168.1.42:5000/api/sensor/data`)
5. Calibrate the soil sensor: upload a quick test sketch that prints `analogRead(34)`, note
   the raw value in dry air and fully in water, and set `DRY_VALUE` / `WET_VALUE` accordingly.
6. Upload and open the Serial Monitor at 115200 baud to confirm readings are being sent.

---

## 10. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/sensor/latest` | Latest reading |
| GET | `/api/sensor/history?page=&limit=&from=&to=` | Paginated history |
| POST | `/api/sensor/data` | ESP32 posts a new reading |

**POST body example:**
```json
{ "soil_moisture": 25, "temperature": 31.2, "humidity": 52 }
```

---

## 11. Demo Mode

Toggle **Demo Mode** on the Dashboard to generate realistic simulated readings every few
seconds (soil moisture 20–75%, temperature 25–35°C, humidity 40–80%) without needing the
ESP32 or backend connected. A **"DEMO MODE — SIMULATED IoT DATA"** badge is shown whenever
it's active. Turn it off to pull real data from the Express API.

---

## 12. Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Dashboard shows "SERVER OFFLINE" | Backend isn't running, or `VITE_API_URL` is wrong |
| Dashboard shows "ESP32 OFFLINE" | Backend is reachable but no recent reading arrived — check ESP32 Wi-Fi/power |
| MySQL connection failed on backend start | Check `.env` credentials and that MySQL is running |
| ESP32 `DHT11` read errors | Check wiring on GPIO4 and that the DHT11 module has a pull-up (bare sensors need an external 4.7–10kΩ resistor) |
| Soil readings stuck at 0% or 100% | Recalibrate `DRY_VALUE` / `WET_VALUE` in the `.ino` file |

---

## 13. Project Viva Explanation

### A. 30-second explanation
"IKS Smart Water Advisor is an IoT system that reads soil moisture, temperature and humidity
using an ESP32, sends that data to a Node.js backend which stores it in MySQL, and displays
it on a React dashboard with a simple rule-based recommendation on whether to irrigate — all
inspired by traditional Indian water-conservation principles."

### B. 2-minute explanation
"The project combines two things: the Indian Knowledge Systems tradition of sustainable water
management — stepwells, tank irrigation, seasonal awareness — with a modern IoT sensing
pipeline. An ESP32 microcontroller reads a capacitive soil moisture sensor and a DHT11
temperature/humidity sensor, then sends this data over Wi-Fi as JSON to a Node.js/Express
REST API. The backend validates the data, applies a simple threshold-based rule (below 30%
moisture = irrigate, 30–60% = monitor, above 60% = no irrigation needed), stores the reading
in a MySQL database, and returns the result. A React frontend polls this API and displays it
through sensor cards, a moisture gauge, a live trend chart, and a plain-language
recommendation. A Demo Mode lets us present the full system even without the physical
hardware connected, which is important for a live college demonstration. The goal isn't to
build an AI model — it's to build an understandable, low-cost decision-support tool that
encourages the same conservation mindset that IKS has promoted for centuries."

### C. Architecture explanation
Farm → sensors (soil + DHT11) → ESP32 → Wi-Fi → Express REST API → MySQL → React dashboard →
irrigation recommendation. Each arrow is a simple, well-defined hand-off: sensors produce raw
values, the ESP32 packages them as JSON, the API validates/decides/stores, and the frontend
visualizes.

### D. Why ESP32?
It has built-in Wi-Fi, enough analog/digital GPIO pins for our sensors, is inexpensive, and is
well supported by the Arduino IDE — ideal for a student IoT prototype.

### E. Why capacitive soil moisture sensor?
Unlike resistive soil sensors, capacitive sensors don't have exposed metal that corrodes over
time from constant contact with wet soil, making them more reliable for continuous outdoor
use.

### F. Why DHT11?
It's a low-cost, widely available digital sensor that gives both temperature and humidity from
a single GPIO pin, which is enough precision for a decision-support prototype (a DHT22 could
be used for higher accuracy if needed).

### G. Why React?
Component-based structure fits a dashboard with repeating cards/pages; its virtual DOM allows
frequent live updates (every few seconds) without full page reloads; huge ecosystem support
(Recharts, React Router) sped up development.

### H. Why Node.js/Express?
JavaScript across the whole stack (frontend and backend) reduces context-switching; Express is
minimal and easy to explain — a handful of routes and controllers, no heavy framework
overhead.

### I. Why MySQL?
The data is naturally tabular (timestamped readings with fixed fields), relational features
like indexing on `created_at` make history queries fast, and MySQL is free, well documented,
and simple to set up locally for a student project.

### J. How does the recommendation work?
It's a plain three-tier rule based purely on soil moisture percentage: below 30% → irrigation
required; 30–60% → monitor; above 60% → no irrigation needed. Temperature and humidity are
included in the explanation text for context but the threshold decision itself is driven by
moisture, keeping the logic transparent and easy to defend in a viva.

### K. How is IKS incorporated?
IKS is incorporated as the project's guiding philosophy and educational content (the IKS
Knowledge page), not as a mathematical input to the algorithm. Traditional principles —
avoiding water waste, seasonal awareness, community-oriented conservation — motivate *why*
the system exists; IoT sensing and the REST/MySQL/React pipeline provide the real-time *how*.

### L. What makes this project innovative?
It bridges a humanities/traditional-knowledge subject (IKS) with a concrete, working IoT and
web-development pipeline, and it's built to survive a live demo through Demo Mode and
Presentation Mode — a practical concern most academic IoT projects ignore.

### M. What are the limitations?
- Single-point sensing (no field-wide coverage or multiple sensor nodes)
- DHT11 has lower accuracy than DHT22
- No authentication on the API (acceptable for a local prototype, not production)
- Rule thresholds are fixed, not adaptive to crop type or soil type
- Requires local Wi-Fi and a running backend for live data (mitigated by Demo Mode)

### N. Future scope
- Multiple sensor nodes across a field, mapped visually
- Automated pump/valve control triggered by the recommendation
- Crop-specific and soil-specific threshold profiles
- SMS/push notifications for irrigation alerts
- Historical analytics and seasonal trend reports
- Integration with weather forecast APIs to pre-empt rainfall

### O. 20 likely viva questions with answers

1. **What problem does this project solve?** — It helps avoid both under- and over-irrigation
   by giving a clear, data-backed recommendation instead of guesswork.
2. **What is IKS?** — Indian Knowledge Systems: traditional Indian knowledge and practices,
   here focused on water and agriculture.
3. **Is this an AI project?** — No. It's rule-based logic with fixed thresholds, chosen
   deliberately for transparency.
4. **What does the ESP32 send to the server?** — A JSON object with `soil_moisture`,
   `temperature`, and `humidity`.
5. **What HTTP method does the ESP32 use?** — POST, to `/api/sensor/data`.
6. **What does the backend do with the incoming reading?** — Validates it, computes the
   irrigation status/recommendation, stores it in MySQL, and returns the saved record.
7. **What are the three irrigation statuses?** — IRRIGATION REQUIRED, MONITOR, NO IRRIGATION.
8. **What are the thresholds?** — Below 30% dry, 30–60% moderate, above 60% sufficient.
9. **Why not use MongoDB?** — The data is structured/tabular and benefits from SQL's
   relational features like indexing and simple aggregate queries; a relational DB fits
   better than a document store here.
10. **What is Demo Mode for?** — To reliably demonstrate the dashboard during a viva/exhibition
    even if the ESP32 or Wi-Fi fails.
11. **How often does the dashboard refresh?** — Every 3–5 seconds, without reloading the page.
12. **What happens if the server is down?** — The dashboard shows a "SERVER OFFLINE" message
    instead of crashing.
13. **What happens if the ESP32 stops sending data?** — The dashboard flags "ESP32 OFFLINE"
    and keeps showing the last known reading.
14. **How is the soil moisture sensor calibrated?** — By recording raw ADC values in dry air
    and in water, then mapping readings between those two bounds to 0–100%.
15. **Why GPIO34 for the soil sensor?** — It's one of the ESP32's input-only ADC-capable pins,
    appropriate for reading an analog sensor.
16. **What library reads the DHT11?** — The Adafruit `DHT sensor library` (with `DHT.h`).
17. **How is security handled?** — Environment variables keep database credentials out of code,
    CORS is enabled, and all SQL queries are parameterized to prevent injection.
18. **Why is there no login/authentication?** — The project is a local single-user prototype;
    authentication was intentionally left out to keep the scope appropriate for a college
    project, as noted in the limitations.
19. **Can this scale to a real farm?** — Not as-is; it would need multiple sensor nodes,
    more robust connectivity (e.g. LoRa for long range), and actuator control — covered under
    future scope.
20. **What was the hardest part to build?** — Answers will vary per student — a good answer
    typically references calibrating the soil sensor, handling the ESP32 disconnect/offline
    cases gracefully, or keeping the recommendation logic simple yet meaningful.

---

## 14. Project Structure

```
iks-smart-water-advisor/
├── client/            React + Vite frontend
├── server/             Node.js + Express backend
├── esp32/               Arduino sketch
├── database/           MySQL schema + demo data
└── README.md
```
