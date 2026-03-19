# Hack4IMPACT Track 2 — Caelifi 🌿⚡

> **KIIT DU | Student Developer & Innovation Summit 2026**  
> Department of Training & Placement, KIIT DU

---

## 👥 Team Details

| Name | Roll Number | Role |
|------|-------------|------|
| Vanshika Rana | 2405022 | Team Lead|
| Shashwat Arya | 2405227 
| Upaayan Naskar | 2405098 
| Saksham Sinha | 2405526 

---

## 🎯 Domain
**Smart Energy / Industrial IoT**

---

## 📌 Problem Statement
Commercial factories with solar + diesel generators cannot safely use solar power during grid outages, forcing them to rely entirely on expensive diesel energy.

---

## 💡 Our Solution — CaeliFi
CaeliFi acts as a **"Traffic Controller"** between the Solar Inverter, the Factory Load, and the Diesel Generator.

It intelligently throttles solar output to prevent back-feed into the diesel generator during grid outages — protecting equipment, saving fuel, and enabling safe hybrid energy usage in real time.

---

## 🛠️ Complete BOM & Tech Stack

### Hardware

| Category | Component | Role in Prototype |
|----------|-----------|-------------------|
| Hardware (Logic) | ESP32 Development Board | Main controller; low-cost architecture for the SME market |
| Hardware (Logic) | Mini Solar Modules | Simulates factory rooftop solar generation |
| Hardware (Logic) | 1x INA219 Power Sensor | Measures actual solar output to prove throttling is occurring |
| Hardware (Logic) | 1x Logic Level MOSFET (IRF520 or IRLZ44N) | Physical actuator that restricts solar power flow, ensuring zero reverse flow |
| Hardware (Inputs) | 1x 10k Ohm Potentiometer | Physical UI dial — simulates factory load fluctuating |
| Hardware (Inputs) | 1x Standard Push Button | Simulates Diesel Generator turning ON; triggers ESP32 "Safe Mode" |
| Hardware (Wiring) | Breadboard & Jumper Wires | Standard 830-tie point board for solderless circuit building |
| Hardware (Wiring) | 1x Rectifier Diode (1N4007) | Protects solar panels from reverse current damage during testing |
| Hardware (Wiring) | 1x 10k Ohm Resistor | Pull-down resistor for push button — ensures clean signal reading |

### Software

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Firmware (Device) | MicroPython + Thonny IDE | Hardware logic, sensor reading, and HTTP request code on the ESP32 |
| Backend | Node.js + Express | Lightweight local server — catches telemetry JSON payloads from ESP32 and broadcasts via WebSockets |
| Frontend | Next.js | Real-time, zero-latency dashboard to visualize data and "Fuel Saved" metrics for judges |



## 🚀 Setup & Run

### Firmware (ESP32)
1. Install [Thonny IDE](https://thonny.org/)
2. Flash MicroPython to your ESP32
3. Upload `firmware/main.py` via Thonny
4. Update WiFi credentials in `main.py`

### Backend
```bash
cd backend
npm install
node server.js
# Server runs on http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Dashboard at http://localhost:3000
```

---

## ⚙️ How It Works

```
[Solar Panel] → [INA219 Sensor] → [ESP32]
                                      |
                          [Potentiometer + Button]
                                      |
                              Reads load & grid state
                                      |
                          [MOSFET throttles solar output]
                                      |
                          [HTTP POST → Node.js backend]
                                      |
                          [WebSocket → Next.js dashboard]
                                      |
                          [Real-time Fuel Saved metrics]
```

---

## 📊 Key Metrics Tracked
- ⚡ Real-time solar wattage (via INA219)
- 🔄 Throttle percentage applied
- 💰 Estimated diesel fuel saved (₹/hour)
- 🔋 Safe Mode status (Generator ON/OFF)

---

*Built with ❤️ at HACK4IMPACT Track 2 — KIIT DU, 2026*
