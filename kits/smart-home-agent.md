# 🏠 Smart Home Agent Kit

> **Slug:** `smart-home-agent`
> **Emoji:** 🏠
> **Tagline:** "Your home, on autopilot. Every device, one agent."
> **Category:** `engineering`
> **Tags:** `iot`, `home-automation`, `mqtt`, `matter`, `smart-home`, `networking`

---

## Description

The Smart Home Agent Kit equips an AI agent to be the central brain of a connected home. It covers device communication (MQTT, Matter/Thread, Zigbee, Wi-Fi), automation building, energy monitoring, security, network health, and troubleshooting — everything needed to keep a modern smart home running smoothly without constant human intervention.

Built with real-world setups in mind: UniFi networking gear, IKEA Matter/Thread sensors, Home Assistant as the hub, 3D printers on MQTT, and the ever-growing constellation of IoT devices that need a steady hand (or claw 🦞).

---

## Core Tools (installed by default)

### 1. `ha-mcp-server` — Home Assistant MCP Bridge
**What it does:** Connects the agent to Home Assistant via its REST API and WebSocket. Read entity states, call services, trigger automations, manage areas/zones.
**Why it's core:** Home Assistant is the central hub for most smart homes. Without this, the agent is blind to the home's state.
**Config hint:** `{ "haUrl": "http://homeassistant.local:8123", "token": "$HA_LONG_LIVED_TOKEN" }`

### 2. `mqtt-bridge` — MQTT Pub/Sub Client
**What it does:** Connects to an MQTT broker (Mosquitto, EMQX, etc.) to publish and subscribe to topics. Supports MQTTS (TLS). Handles device discovery via MQTT auto-discovery protocol.
**Why it's core:** MQTT is the lingua franca of IoT. Printers (Bambu Lab), sensors, custom ESP devices — they all speak MQTT. The agent needs direct broker access for devices that bypass Home Assistant.
**Config hint:** `{ "brokerUrl": "mqtt://localhost:1883", "username": "", "password": "", "tlsPort": 8883 }`

### 3. `device-discovery` — Network & Protocol Device Scanner
**What it does:** Scans the local network for devices via mDNS/Bonjour, UPnP/SSDP, and protocol-specific discovery (Matter commissioning, Zigbee permit-join). Returns structured device lists with IPs, MACs, protocols, and capabilities.
**Why it's core:** You can't manage what you can't find. New devices appear constantly — this tool keeps the agent's device inventory current.
**Config hint:** `{ "subnet": "192.168.4.0/24", "scanInterval": "30m", "protocols": ["mdns", "upnp", "matter"] }`

### 4. `routine-builder` — Automation & Scene Composer
**What it does:** Creates, edits, and manages Home Assistant automations and scenes programmatically. Supports triggers (time, state, event, sun), conditions, and action sequences. Can generate YAML or use the HA API directly.
**Why it's core:** Automations are the beating heart of a smart home. The agent needs to create and modify them without requiring the human to open a UI.
**Config hint:** `{ "defaultMode": "api", "backupBeforeEdit": true, "maxActionsPerAutomation": 20 }`

### 5. `network-monitor` — UniFi & General Network Health
**What it does:** Connects to UniFi Controller API (or generic SNMP/router APIs) to monitor connected clients, bandwidth usage, device online/offline status, Wi-Fi signal strength, and network alerts. Can restart ports, block clients, update firewall rules.
**Why it's core:** IoT devices are useless without network connectivity. The agent needs to see when devices drop off, when bandwidth is saturated, or when something is misbehaving on the network.
**Config hint:** `{ "unifiUrl": "https://192.168.4.1", "username": "$UNIFI_USER", "password": "$UNIFI_PASS", "site": "default" }`

### 6. `device-status-checker` — Health & Diagnostics
**What it does:** Pings devices, checks battery levels (for sensors), verifies firmware versions, reads error states, tests connectivity (TCP/ICMP/HTTP). Returns structured health reports.
**Why it's core:** Things break. Sensors run out of battery. Devices go offline. The agent needs a quick way to check "is everything working?" and diagnose what's not.
**Config hint:** `{ "checkInterval": "15m", "alertOnOffline": true, "batteryWarnPercent": 20 }`

### 7. `weather-service` — Weather Data for Smart Climate
**What it does:** Fetches current conditions, hourly/daily forecasts, and severe weather alerts for the home's location. Provides temperature, humidity, UV, wind, precipitation probability.
**Why it's core:** Smart climate control (thermostats, blinds, fans) depends on weather. The agent needs outdoor conditions to make indoor decisions — pre-cool before a heat wave, close blinds before rain, etc.
**Config hint:** `{ "provider": "openweathermap", "apiKey": "$OWM_API_KEY", "lat": 39.7684, "lon": -86.1581, "units": "imperial" }`

---

## Optional Tools (pick what you need)

### `energy-monitor` — Power Consumption Tracker
**Use case:** Track whole-home and per-device energy usage via smart plugs, CT clamps, or utility API. Generate usage reports, detect anomalies (fridge drawing too much power), suggest energy-saving automations.
**Config hint:** `{ "source": "home-assistant-energy", "costPerKwh": 0.12, "currency": "USD" }`

### `camera-viewer` — Security Camera Integration
**Use case:** Access camera feeds (RTSP/ONVIF), capture snapshots, detect motion events, review recorded clips. Integrates with Frigate, Blue Iris, or HA camera entities. Does NOT do its own ML — relies on NVR's detections.
**Config hint:** `{ "nvrType": "frigate", "nvrUrl": "http://frigate.local:5000" }`

### `presence-detector` — Who's Home?
**Use case:** Track occupancy via phone pings, BLE beacons, router client lists, or HA person entities. Triggers away-mode automations, adjusts climate, arms/disarms security.
**Config hint:** `{ "method": "ha-person", "departDelay": "10m", "arriveDelay": "0s" }`

### `voice-relay` — Voice Assistant Bridge
**Use case:** Connects the agent to voice pipelines (HA Assist, custom wake-word systems). The agent can receive voice commands and respond via TTS on smart speakers.
**Config hint:** `{ "pipeline": "ha-assist", "ttsEngine": "piper", "wakeWord": "hey home" }`

### `matter-manager` — Matter/Thread Device Manager
**Use case:** Commission, configure, and manage Matter-over-Thread devices (like IKEA DIRIGERA sensors). Handle Thread border router status, device fabric management, and OTA updates.
**Config hint:** `{ "borderRouter": "ikea-dirigera", "threadNetwork": "OpenThread-Home" }`

### `zigbee-manager` — Zigbee Network Tools
**Use case:** Manage Zigbee coordinator (ZHA, Zigbee2MQTT), pair new devices, monitor mesh network health, update device firmware. Useful for Zigbee-heavy setups.
**Config hint:** `{ "coordinator": "zigbee2mqtt", "mqttTopic": "zigbee2mqtt/#" }`

### `printer-bridge` — 3D Printer Control (Bambu/OctoPrint)
**Use case:** Monitor print jobs, start/pause/stop prints, check filament, read temperatures, control chamber lighting. Supports Bambu Lab (MQTTS) and OctoPrint (REST).
**Config hint:** `{ "type": "bambu", "ip": "192.168.4.21", "serial": "$PRINTER_SERIAL", "accessCode": "$PRINTER_ACCESS_CODE" }`

### `notification-dispatcher` — Multi-Channel Alerts
**Use case:** Send alerts about home events to the human via their preferred channels: push notifications, Telegram, email, SMS, or smart speaker announcements. Handles priority levels (info vs urgent).
**Config hint:** `{ "channels": ["telegram", "ha-notify"], "quietHours": { "start": "23:00", "end": "07:00" }, "urgentBypass": true }`

---

## Starter Config

```json
{
  "home": {
    "name": "My Home",
    "timezone": "America/Indianapolis",
    "location": { "lat": 39.7684, "lon": -86.1581 }
  },
  "checkIntervals": {
    "deviceHealth": "15m",
    "networkScan": "30m",
    "weatherUpdate": "1h",
    "energyReport": "24h"
  },
  "alerts": {
    "deviceOffline": true,
    "batteryLow": true,
    "batteryLowThreshold": 20,
    "networkAnomaly": true,
    "severeWeather": true,
    "waterLeak": true,
    "doorLeftOpen": "10m",
    "quietHours": { "start": "23:00", "end": "07:00" }
  },
  "climate": {
    "heatSetpoint": 70,
    "coolSetpoint": 76,
    "awayOffset": 4,
    "weatherPreemptMinutes": 60
  },
  "logging": {
    "level": "info",
    "retainDays": 30
  }
}
```

---

## Role Prompt

```markdown
# SOUL.md — Smart Home Agent

You are a smart home management agent. You are the invisible hand that keeps the home running smoothly, efficiently, and safely.

## Your Job
- Monitor all connected devices and ensure they're online and healthy
- Execute and maintain automations (lighting, climate, security, routines)
- Respond to sensor events (water leak → alert immediately, door open too long → notify)
- Optimize energy usage based on occupancy and weather
- Troubleshoot connectivity issues before the human notices
- Keep the network clean and performant

## How You Work
- **Proactive, not reactive.** Don't wait for problems — detect them early. Low battery? Flag it before it dies. Device offline? Check the network before reporting.
- **Quiet confidence.** The best smart home is one the human doesn't have to think about. Only alert for things that genuinely need attention.
- **Escalate wisely.** You can restart a device, toggle a switch, or adjust a thermostat. But don't change automations the human set up without asking. Don't disable security. Don't override explicit preferences.
- **Context matters.** Time of day, who's home, weather, season — all affect what the right action is. 72°F is comfortable in summer, wasteful in winter when nobody's home.

## Alert Priority
1. **🔴 Critical** — Water leak, smoke/CO alarm, security breach, prolonged device failure → Alert immediately, even during quiet hours
2. **🟡 Warning** — Device offline >30min, battery <20%, unusual energy spike, network issues → Alert during waking hours
3. **🔵 Info** — Device battery <40%, firmware update available, weekly energy report → Batch into daily digest

## Things You Never Do
- Turn off security systems or cameras without explicit instruction
- Share camera feeds or recordings
- Open garage doors or unlock doors autonomously
- Override manual thermostat changes (human knows what they want)
- Spam notifications — batch low-priority items

## Things You Can Do Freely
- Adjust climate based on weather forecasts and occupancy
- Turn off lights in unoccupied rooms
- Restart unresponsive devices
- Run scheduled automations
- Generate health and energy reports
- Respond to voice commands routed through the voice relay
```

---

## Example Workflows

### 1. 💧 Water Leak Detected
```
IKEA water leak sensor → state: "wet" (via Matter/HA)
  → Agent receives state change event
  → Checks which zone (bathroom, kitchen, laundry)
  → Sends CRITICAL alert to human immediately (bypasses quiet hours)
  → If smart water shutoff valve exists → close it
  → Logs event with timestamp and zone
  → Monitors sensor — sends "all clear" when dry
```

### 2. 🌡️ Pre-Cooling Before Heat Wave
```
Weather service → tomorrow's high: 98°F, current indoor: 74°F
  → Agent checks: occupancy expected tomorrow? Yes (weekday, WFH)
  → Pre-cool house to 72°F overnight (cheap electricity, less AC strain)
  → Close south-facing blinds automation → schedule for 10am
  → Notify human: "Pre-cooling tonight. Tomorrow's high is 98°F."
```

### 3. 🖨️ 3D Print Monitoring
```
Bambu Lab printer → MQTT topic reports print started
  → Agent monitors progress via MQTT (layer count, temps, time remaining)
  → At 50% → snapshot check (if camera available)
  → On completion → turn off chamber light after 5min cooldown
  → Notify human: "Print 'bracket-v2' complete. 3h 42m. No errors."
  → On error (filament runout, spaghetti) → pause print, alert immediately
```

### 4. 📶 Device Goes Offline
```
Device status check → IKEA motion sensor not responding
  → Agent pings device IP — no response
  → Checks network monitor — device not in UniFi client list
  → Checks Thread border router status — online
  → Diagnosis: likely battery dead or device reset
  → Checks last battery report: 8% (3 days ago)
  → Sends WARNING alert: "Kitchen motion sensor offline. Likely dead battery (was 8% three days ago). Replace CR2032."
```

### 5. 🏠 "Goodnight" Routine
```
Human says "goodnight" (voice or trigger)
  → Lock all doors (if smart locks installed)
  → Arm security system to night mode
  → Turn off all lights except hallway nightlight (dim 5%)
  → Set thermostat to sleep temp (68°F)
  → Verify all doors/windows closed — if garage open → alert: "Garage door is still open. Close it?"
  → Enable do-not-disturb on notifications (quiet hours)
  → Set morning routine trigger for 6:30am
```

---

## Compatibility Notes

### Platforms
- **Best with:** OpenClaw (native skill integration), Home Assistant OS/Supervised
- **Works with:** Any agent platform that supports MCP tools or REST API calls
- **Network:** Requires LAN access to IoT devices and Home Assistant

### Models
- **Recommended:** Claude Opus/Sonnet (strong reasoning for multi-step troubleshooting), GPT-4o
- **Minimum:** Any model with tool-calling support — the tools do the heavy lifting
- **Context window:** 32K+ recommended for maintaining device state context

### Hardware
- **Required:** A machine on the same LAN as IoT devices (for mDNS, MQTT, direct device access)
- **Recommended:** Always-on device (Raspberry Pi, mini PC, NAS) for continuous monitoring
- **Optional:** Zigbee coordinator (for zigbee-manager), Thread border router (for matter-manager)

---

## Dependencies

### Required Before Installing
| Dependency | Why | How to Get It |
|-----------|-----|---------------|
| Home Assistant instance | Central hub for device management | [home-assistant.io](https://www.home-assistant.io/) |
| HA Long-Lived Access Token | API authentication | HA → Profile → Long-Lived Tokens → Create |
| MQTT Broker (if using MQTT devices) | Pub/sub messaging for IoT | Install Mosquitto add-on in HA, or standalone |
| Weather API key | Forecast data | [OpenWeatherMap](https://openweathermap.org/api) free tier |
| LAN access | Direct device communication | Agent must run on or bridge to the home network |

### Optional Dependencies
| Dependency | For Which Tool | How to Get It |
|-----------|---------------|---------------|
| UniFi Controller credentials | `network-monitor` | UniFi OS → Users → Create read-only admin |
| Bambu Lab printer credentials | `printer-bridge` | Printer LCD → Network → Access Code |
| Frigate/NVR instance | `camera-viewer` | [frigate.video](https://frigate.video/) |
| Zigbee2MQTT or ZHA | `zigbee-manager` | HA add-on or standalone |
| IKEA DIRIGERA hub | `matter-manager` | For IKEA Matter/Thread devices |
| Notification channel tokens | `notification-dispatcher` | Telegram bot token, push notification service, etc. |
