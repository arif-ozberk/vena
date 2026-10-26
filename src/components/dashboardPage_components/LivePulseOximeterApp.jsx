import React, { useState, useEffect, useRef, useContext } from 'react';

// Styles
import styles from "../../sass/dashboardPage_styles/LivePulseOximeterApp.module.scss";

// x-charts
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';

// Context
import { AuthContext } from '../../context/AuthContext';

// Vena-DB
import pulseOximeterDB from '../../config/pulseOximeterDB';

// React-Toastify
import { toast } from 'react-toastify';
import toastifyOptions from '../../mocks/toastifyOptions';

// React-Icons
import { VscDebugDisconnect } from "react-icons/vsc";
import { PiBluetoothConnected } from "react-icons/pi";

// ESP32 BLE GATT Tanımlamaları
const BLE_SERVICE_UUID = "19b10000-e8f2-537e-4f6c-d104768a1214";
const BLE_CHARACTERISTIC_UUID = "19b10001-e8f2-537e-4f6c-d104768a1214";
const BLE_DEVICE_NAME = "Vena_Oximeter";


const LivePulseOximeterApp = () => {
    // User Info
    const { loggedUserData } = useContext(AuthContext);
    const userId = loggedUserData?.user_settings?.user_id || loggedUserData?.id;
 
    // Bluetooth and Sensor Status
    const [bleDevice, setBleDevice] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [sensorData, setSensorData] = useState({ bpm: 0, spo2: 0, finger: false });

    // Supabase 5 second interval refs
    const sensorDataRef = useRef(sensorData);
    const isConnectedRef = useRef(isConnected);
    const isSavingRef = useRef(false); // Block conflicted requests

    useEffect(() => {
        sensorDataRef.current = sensorData;
    }, [sensorData]);

    useEffect(() => {
        isConnectedRef.current = isConnected;
    }, [isConnected]);

    // Function runs when physical connection lost
    const handleDisconnection = () => {
        console.warn("BLE: Connection lost.");
        // toast.error("BLE: Connection lost.", toastifyOptions.darkTopRight);
        setIsConnected(false);
        setBleDevice(null);
        setSensorData({ bpm: 0, spo2: 0, finger: false });
    };

    // Bluetooth Connection Manager
    const handleConnectBluetooth = async () => {
        if (!navigator.bluetooth) {
            console.warn("WARNING: Browser does not support Bluetooth API.");
            toast.error("WARNING: Browser does not support Bluetooth API.", toastifyOptions.darkTopRight);
            return;
        }

        const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
        if (!isBluetoothAvailable) {
            console.warn("WARNING: Bluetooth is turned off. Request terminated.");
            toast.error("WARNING: Bluetooth is turned off. Request terminated.", toastifyOptions.darkTopRight);
            return;
        }

        try {
            console.log("BLE: Scanning device...");
            toast.info("BLE: Scanning device...", toastifyOptions.darkTopRight);
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ name: BLE_DEVICE_NAME }],
                optionalServices: [BLE_SERVICE_UUID]
            });

            device.addEventListener('gattserverdisconnected', handleDisconnection);

            const server = await device.gatt.connect();
            const service = await server.getPrimaryService(BLE_SERVICE_UUID);
            const characteristic = await service.getCharacteristic(BLE_CHARACTERISTIC_UUID);

            await characteristic.startNotifications();
            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const decoder = new TextDecoder('utf-8');
                const rawJson = decoder.decode(event.target.value);

                try {
                    const parsedData = JSON.parse(rawJson);
                    setSensorData(parsedData);
                } catch (err) {
                    console.error("Could not solve incoming JSON.", err, rawJson);
                }
            });

            setBleDevice(device);
            setIsConnected(true);
            console.log("BLE: Device connected successfully.");
            toast.success("BLE: Device connected successfully.", toastifyOptions.darkTopRight);
        } catch (error) {
            console.warn("BLE Bağlantı hatası veya kullanıcı pencereyi kapattı:", error);
            toast.error("BLE: Connection error.", toastifyOptions.darkTopRight);
        }
    };

    // Manuel Connection Cutting
    const handleDisconnectBluetooth = () => {
        if (bleDevice && bleDevice.gatt.connected) {
            bleDevice.gatt.disconnect();
        }
        handleDisconnection();
        toast.error("BLE: Device disconnected.", toastifyOptions.darkTopRight);
    };

    useEffect(() => {
        return () => {
            if (bleDevice && bleDevice.gatt.connected) {
                bleDevice.gatt.disconnect();
            }
        };
    }, [bleDevice]);


    // 5 Second Periodic Timer
    useEffect(() => {
        const intervalId = setInterval(() => {
            // saveReadingToSupabase();
            pulseOximeterDB.saveReadingToSupabase(userId, isSavingRef, sensorDataRef, isConnectedRef);
        }, 5000);

        return () => clearInterval(intervalId);
    }, [userId]);

    // Value checks for visual interperet
    const isBpmValid = sensorData.finger && sensorData.bpm > 0;
    const isSpo2Valid = sensorData.finger && sensorData.spo2 > 0;

    // Responsive Gauge Styles
    const gaugeStyles = {
        [`& .${gaugeClasses.valueArc}`]: {
            fill: '#ff3b30',
        },
        [`& .${gaugeClasses.valueText}`]: {
            fontSize: 20,
            fontWeight: 400,
            fill: '#f3f4f6 !important',
            color: '#f3f4f6 !important',
            transform: 'translate(0px, 0px)',
            '@media (max-width: 1024px)': {
                fontSize: 16,
            },
            '& tspan': {
                fill: '#f3f4f6 !important',
            },
        },
    };

    return (
        <div className={styles.livePulseOximeterApp}>
            <div className={styles.topRow}>
                <p className={styles.deviceStatus}>
                    Device Status: {
                        isConnected ? <strong>Connected <PiBluetoothConnected /></strong> :
                        <strong>Disconnected <VscDebugDisconnect /></strong>
                    }
                </p>
                <button
                    className={styles.connectDeviceButton}
                    onClick={isConnected ? handleDisconnectBluetooth : handleConnectBluetooth}
                >
                    {isConnected ? "Disconnect Device" : "Connect Device"}
                </button>
            </div>

            <div className={styles.bottomRow}>
                {/* BPM Gauge */}
                <Gauge
                    value={isBpmValid ? sensorData.bpm : 0}
                    valueMin={0}
                    valueMax={200}
                    startAngle={-120}
                    endAngle={120}
                    sx={gaugeStyles}
                    text={() => (isBpmValid ? `BPM: ${sensorData.bpm}` : 'BPM: --')}
                />

                {/* SpO2 Gauge */}
                <Gauge
                    value={isSpo2Valid ? sensorData.spo2 : 0}
                    valueMin={0}
                    valueMax={100}
                    startAngle={-120}
                    endAngle={120}
                    sx={gaugeStyles}
                    text={() => (isSpo2Valid ? `SpO2: %${sensorData.spo2}` : 'SpO2: --')}
                />
            </div>
        </div>
    );
};

export default LivePulseOximeterApp;