import time
import network
import urequests
import ujson
from machine import Pin, ADC, PWM, I2C
from ina219 import INA219

WIFI_SSID = "WIN-7CBRB18PEP0 5553"
WIFI_PASS = "e8&761M2"
NEXTJS_API_URL = "http://192.168.137.1:5000/api/dashboard/telemetry"
dg_toggle_state = False
last_button_value = 1

print("Waking up CaeliFi...")
print("Attempting to connect to Wi-Fi:", WIFI_SSID)

wifi = network.WLAN(network.STA_IF)
wifi.active(True)
wifi.connect(WIFI_SSID, WIFI_PASS)

# The new heartbeat loop
timeout = 20
while not wifi.isconnected() and timeout > 0:
    print(".", end="")
    time.sleep(0.5)
    timeout -= 1

if wifi.isconnected():
    print("\nSuccess! Wi-Fi Connected.")
    print("ESP32 IP Address:", wifi.ifconfig()[0])
else:
    print("\nFailed to connect to Wi-Fi! Check SSID, Password, or 2.4GHz band.")

dg_button = Pin(14, Pin.IN, Pin.PULL_UP)
load_dial = ADC(Pin(34))
load_dial.atten(ADC.ATTN_11DB)
solar_throttle = PWM(Pin(15), freq=1000)
solar_throttle.duty(1023)

i2c = I2C(0, scl=Pin(22), sda=Pin(21))
sensor = INA219(i2c)

while True:
    # 1. Handle Toggle Logic
    current_button_value = dg_button.value()
    
    # Check if button was just pressed (transition from 1 to 0)
    if last_button_value == 1 and current_button_value == 0:
        dg_toggle_state = not dg_toggle_state
        print("DG Toggle Switched:", "ON" if dg_toggle_state else "OFF")
        time.sleep(0.1)  # Simple debounce delay
        
    last_button_value = current_button_value
    
    # 2. Existing Logic (using dg_toggle_state instead of dg_is_on)
    raw_load = load_dial.read()
    factory_load_watts = int((raw_load / 4095) * 20000)
    
    # Use our new toggle state here
    dg_is_on = dg_toggle_state
    
    volts = sensor.get_bus_voltage_v()
    amps = sensor.get_current_ma() / 1000.0
    actual_solar_watts = max(0, volts * amps)
    
    simulated_capacity = 15000
    solar_output_watts = simulated_capacity
    mode = "Normal"
    pwm_duty = 1023
    
    if dg_is_on and simulated_capacity > factory_load_watts:
        mode = "Safe Mode"
        solar_output_watts = max(0, factory_load_watts - 1000)
        pwm_ratio = solar_output_watts / simulated_capacity
        pwm_duty = int(1023 * pwm_ratio)
        
    solar_throttle.duty(pwm_duty)
    
    # 3. Telemetry and Payload (unchanged)
    print("\n=== CaeliFi Telemetry ===")
    print("Mode:", mode)
    print("DG Status:", "ON" if dg_is_on else "OFF")
    print("Factory Load:", factory_load_watts, "W")
    print(f"Physical Flow: {volts:.2f}V | {amps:.3f}A | {actual_solar_watts:.2f}W")
    print("=========================")
    
    payload = {
        "mode": mode,
        "dg_status": dg_is_on,
        "factory_load": factory_load_watts,
        "target_solar": solar_output_watts,
        "actual_volts": volts,
        "actual_amps": amps,
        "actual_watts": actual_solar_watts
    }
    
    print("Sending to dashboard...", end=" ")
    try:
        headers = {'Content-Type': 'application/json'}
        response = urequests.post(NEXTJS_API_URL, data=ujson.dumps(payload), headers=headers)
        response.close()
        print("OK!")
    except Exception as e:
        print("FAILED!", e)
        
    # Keep the sleep small enough to feel responsive to the button press
    time.sleep(0.1)
