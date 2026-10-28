# 🫀 Vena — IoT-Enabled Pulse Oximeter & Telemetry Platform

<p align="center">
  <img src="https://img.shields.io/badge/Hardware-ESP32--C3%20Super%20Mini-blue?style=for-the-badge&logo=espressif" alt="ESP32-C3">
  <img src="https://img.shields.io/badge/Sensor-MAX30102%20PPG-red?style=for-the-badge" alt="MAX30102">
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-61DAFB?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase">
  <img src="https://img.shields.io/badge/Protocol-Web%20Bluetooth%20(BLE)-0082FC?style=for-the-badge&logo=bluetooth" alt="BLE">
  <img src="https://img.shields.io/badge/Styling-SCSS%20%7C%20MUI%20X--Charts-CC6699?style=for-the-badge&logo=sass" alt="SCSS">
</p>

---

## 📌 Project Overview

**Vena** is a portable, cloud-connected biomedical IoT telemetry platform designed to perform non-invasive, continuous photoplethysmography (**PPG**) measurements for Heart Rate (**BPM**) and peripheral capillary oxygen saturation (**SpO₂**).

Operating as a standalone point-of-care vital sign monitor, Vena delivers local readings via an onboard OLED display while establishing a direct, driverless connection to a web dashboard using **Bluetooth Low Energy (BLE)** and the browser-native **Web Bluetooth API**. Continuous biometric data is dynamically visualized in responsive dashboards and archived into **Supabase (PostgreSQL)** using an optimized daily JSONB array model to support long-term physiological trend analysis.

---

## ✨ Key Features

- **Local Low-Latency Display:** High-contrast 0.96" SSD1306 OLED visualization operating over a 400 kHz Fast I2C bus with $<200\text{ ms}$ rendering latency.
- **Dynamic 32-Bit Peak Detector (DSP):** Custom optical systolic peak detection with a 300 ms refractory window to eliminate dicrotic notch false-triggers and bypass legacy 16-bit integer overflow bugs.
- **Zero-Driver Web Telemetry:** Native in-browser Web Bluetooth API connection (`Vena_Oximeter`) with real-time JSON payload streaming (`{"bpm": X, "spo2": Y, "finger": bool}`).
- **Responsive MUI Gauges:** Custom-styled gauges featuring automatic font-size adaptation for screen widths $<1024\text{px}$, state-based `--` placeholders, and an alert state (`#ac231c`) for critical oxygen saturation levels below 95%.
- **Smart JSONB Database Aggregation:** Periodic logging every 5 seconds that appends validated vitals (40–180 BPM, 80–100% SpO₂) into a single row per day, avoiding database bloat.
- **Smooth 7-Day Trend Analytics:** Filterable Bar Chart (`BPM / SpO₂` and `Avg / Max / Min`) showing the last 7 recorded measurement days without chart unmounting or flickering during live sessions.
- **Self-Contained Power Management:** Lithium-polymer power architecture featuring a TP4056 Type-C module with integrated battery protection (DW01/MOSFET), a 1050mAh LiPo battery, and a physical ON/OFF switch.

---

## 🛠️ Hardware & Software Stack

### 🔌 Hardware Components
| Component | Function / Specification |
| :--- | :--- |
| **ESP32-C3 Super Mini** | Single-core 32-bit RISC-V microcontroller (160 MHz), integrated 2.4 GHz Wi-Fi & BLE 5.0. |
| **MAX30102** | Integrated pulse oximetry and heart-rate optical biosensor (660 nm Red & 940 nm IR LEDs, 18-bit ADC). |
| **SSD1306 OLED** | 0.96-inch monochrome display (128x64 pixels, I2C interface). |
| **TP4056 (Type-C)** | Constant-current/constant-voltage (CC/CV) linear LiPo battery charge management board with protection. |
| **Tinylab 1S LiPo** | 3.7V nominal, 1050mAh capacity, 40C discharge rate. |
| **IC-125B Mini Switch** | 2-Position (SPST / ON-OFF) physical power cut-off switch. |

### 💻 Firmware Architecture
- **Language & Framework:** C/C++ on Arduino IDE with Espressif ESP32 Core.
- **MAX3010x Driver:** Low-level register access and optical FIFO configuration via SparkFun MAX3010x library.
- **Graphic Engine:** Adafruit SSD1306 & Adafruit GFX running non-blocking UI state updates.
- **BLE GATT Profile:**
  - **Device Name:** `Vena_Oximeter`
  - **Service UUID:** `19b10000-e8f2-537e-4f6c-d104768a1214`
  - **Characteristic UUID (Notify/Read):** `19b10001-e8f2-537e-4f6c-d104768a1214`

### 🌐 Web & Cloud Architecture
- **Frontend Core:** React 18, Vite, React Router DOM, JavaScript (ES6+).
- **Wireless Layer:** Web Bluetooth API (GATT Server Client).
- **Data Visualization:** `@mui/x-charts` (`<Gauge>`, `<BarChart>`).
- **Styling Architecture:** SASS / SCSS Modules, CSS Grid, Flexbox, custom media queries.
- **Backend & Storage:** Supabase (PostgreSQL, Row Level Security, JSONB operators).
- **Deployment:** Vercel (Enforces mandatory HTTPS for Web Bluetooth communication).

---

## 📐 Circuit Wiring & Schematic

Both I2C peripherals share the hardware I2C bus on the ESP32-C3 Super Mini (**GPIO 8 / GPIO 9**).

```
                  ┌──────────────────────────────────────────────┐
                  │              Tinylab LiPo 3.7V               │
                  │                 (1050 mAh)                   │
                  └──────┬───────────────────────────────┬───────┘
                     (+) │                               │ (-)
                         ▼                               ▼
                  ┌──────────────┐               ┌──────────────┐
                  │  TP4056 B+   │               │  TP4056 B-   │
                  └──────────────┘               └──────────────┘
                         │                               │
                   [TP4056 OUT+]                   [TP4056 OUT-]
                         │                               │
                 ┌───────▼───────┐                       │
                 │ IC-125B SWITCH│                       │
                 └───────┬───────┘                       │
                         │                               │
                         ▼                               ▼
                  ┌──────────────┐               ┌──────────────┐
                  │ ESP32-C3 5V  │               │ ESP32-C3 GND │
                  └──────────────┘               └──────────────┘
                         │                               │
        ┌────────────────┴──────────────┐                │
        │ Onboard 3.3V LDO Output       │                │
        ▼                               ▼                ▼
┌──────────────┐                 ┌──────────────┐ ┌──────────────┐
│ SSD1306 OLED │                 │   MAX30102   │ │  Common GND  │
│  VCC    GND  │                 │   VIN    GND │ │     Rail     │
└───────┬──────┘                 └───────┬──────┘ └──────────────┘
        │                                │
        ├──────────── SDA ───────────────┤ ──► ESP32-C3 GPIO 8
        │                                │
        └──────────── SCL ───────────────┘ ──► ESP32-C3 GPIO 9
```

### Pin Allocation Table
| Module Pin | ESP32-C3 Super Mini Pin | Description |
| :--- | :--- | :--- |
| **OLED VCC** & **MAX30102 VIN** | **3V3** | Regulated 3.3V power line from ESP32 LDO |
| **OLED GND** & **MAX30102 GND** | **GND** | System common ground |
| **OLED SDA** & **MAX30102 SDA** | **GPIO 8** | Shared I2C data line |
| **OLED SCL** & **MAX30102 SCL** | **GPIO 9** | Shared I2C clock line |
| **TP4056 OUT+** | **5V (VBUS)** | Routed through the toggle switch to input of onboard LDO |
| **TP4056 OUT-** | **GND** | Direct ground return from protection circuitry |

> ⚠️ **Electrical Safety Rule:** To prevent voltage collision between computer USB power (5.0V) and battery output (~4.2V), **always turn the IC-125B switch OFF** when connecting the ESP32-C3 to a computer for firmware flashing. When recharging the battery, connect the USB Type-C cable directly to the **TP4056 charging module**.

---

## 🗄️ Database Schema (Supabase PostgreSQL)

Vitals are stored in the `pulse_oximeter` table, protected by user ownership constraints:

```sql
create table public.pulse_oximeter (
  measurement_id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.user_settings(user_id) on delete cascade not null,
  measurement_data jsonb not null default '{}'::jsonb
);
```

### JSONB Payload Model (`measurement_data`)
A single database row represents an entire day of monitoring. Validated periodic samples are continuously appended to the `readings` array:

```json
{
  "readings": [
    {
      "bpm": 74,
      "spo2": 98,
      "timestamp": "2026-10-28T14:20:00.123Z"
    },
    {
      "bpm": 76,
      "spo2": 97,
      "timestamp": "2026-10-28T14:20:05.123Z"
    }
  ]
}
```

---

## 🔬 Biosignal Processing & Algorithm Design

1. **Photoplethysmography (PPG) Acquisition:** The MAX30102 shines alternate 660 nm (Red) and 940 nm (Infrared) light through the capillary bed at 100 Hz. The photodetector measures the non-absorbed light intensity, converted into an 18-bit digital count.
2. **DC Baseline Tracking & Inversion:** A low-pass moving-average filter extracts the non-pulsatile direct current component:
   $$DC_t = 0.98 \times DC_{t-1} + 0.02 \times \text{IR}_t$$
   The pulsatile AC arterial waveform is isolated and inverted ($AC_t = DC_t - \text{IR}_t$) so systolic heartbeats register as positive amplitude peaks.
3. **Adaptive Threshold Peak Detector:** Arterial expansion creates a local peak. Once a peak crosses the dynamically decayed threshold ($Th_{next} = 0.60 \times Peak$), a beat is verified, enforcing a 300 ms refractory period to ignore dicrotic notch reflections.
4. **Modulation Ratio ($R$) & Oxygen Saturation:**
   $$R = \frac{AC_{\text{Red}} / DC_{\text{Red}}}{AC_{\text{IR}} / DC_{\text{IR}}}$$
   $$\text{SpO}_2 = 110 - 25 \times R$$
   Computed SpO₂ values are bounded within the physiological window ($80\% - 100\%$) and displayed live.

---

## 🚀 Setup & Installation

### Embedded Firmware Setup (Arduino IDE)
1. Install the ESP32 board definition in Arduino IDE (`Tools > Board > Boards Manager > esp32 by Espressif Systems`).
2. Select target board: `Tools > Board > ESP32 Arduino > ESP32C3 Dev Module`.
3. Open **Library Manager (`Ctrl+Shift+I`)** and install:
   - `SparkFun MAX3010x Pulse and Proximity Sensor Library`
   - `Adafruit SSD1306`
   - `Adafruit GFX Library`
4. Set memory partitioning to fit BLE dependencies:
   - `Tools > Partition Scheme > "Huge APP (3MB No OTA/1MB SPIFFS)"`
5. Compile and upload firmware to the ESP32-C3 Super Mini.

---

## 👨‍💻 Engineering Context

Vena was engineered as a comprehensive biomedical instrumentation and clinical IoT project, bridging optoelectronic sensor design, digital signal conditioning, low-energy telemetry, and modern cloud telemetry systems.