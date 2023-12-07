import React, { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';

const DirectGattConnect = ({
    zpl = '^XA^FO0,0^A0,30,30^FDHello, Supplier Label App^FS^XZ'
}) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [gattServer, setGattServer] = useState(null);
    const selectedServiceUUID = '38eb4a80-c570-11e3-9507-0002a5d5c51b'; // Specific service UUID
    const selectedCharacteristicUUID = '38eb4a82-c570-11e3-9507-0002a5d5c51b'; // Specific characteristic UUID

    useEffect(() => {
        async function connectToBluetoothDevice() {
            try {
                // Request the Bluetooth device with the specific service UUID as an optional service
                const device = await navigator.bluetooth.requestDevice({
                    filters: [
                        {
                            services: [selectedServiceUUID],
                        },
                    ],
                    optionalServices: [selectedServiceUUID], // Specify the service UUID as optional
                });

                // Connect to the GATT server of the selected device
                const server = await device.gatt.connect();

                setGattServer(server);
                setErrorMessage(null); // Clear any previous errors
            } catch (error) {
                console.error('Bluetooth error:', error);
                setErrorMessage('Failed to connect to the Bluetooth device: ' + error.message);
            }
        }

        connectToBluetoothDevice();
    }, []);

    const printZpl = async () => {
        try {
            if (!gattServer) {
                setErrorMessage('Not connected to GATT server');
                return;
            }

            // Encode the ZPL command
            // const zpl = '^XA^FO0,0^A0,30,30^FDHello, Supplier Label App^FS^XZ';
            const encoder = new TextEncoder('utf-8');
            const data = encoder.encode(zpl);

            // Get the selected service and characteristic
            const selectedService = await gattServer.getPrimaryService(selectedServiceUUID);
            const selectedCharacteristic = await selectedService.getCharacteristic(selectedCharacteristicUUID);

            // Send the ZPL command
            await selectedCharacteristic.writeValue(data);

            setErrorMessage(null); // Clear any previous errors
        } catch (error) {
            setErrorMessage('Failed to send ZPL command: ' + error.message);
        }
    };

    return (
        <Card className="m-3">
            <Button onClick={printZpl} className="m-1">Print ZPL</Button>
            <Text style={{color: "red"}}>
                {errorMessage}
            </Text>
        </Card>
    );
};

export default DirectGattConnect;
