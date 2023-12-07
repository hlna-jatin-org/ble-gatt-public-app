import React, { useState, useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { sendChunksSynchronously } from './printUtils'
import ZplByteSizeCalculator from './ZplByteSizeCalculator'

const PrintZpl = ({ gattServer }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [serviceUUID, setServiceUUID] = useState('38eb4a80-c570-11e3-9507-0002a5d5c51b'); // Default service UUID
    const [characteristicUUID, setCharacteristicUUID] = useState('38eb4a82-c570-11e3-9507-0002a5d5c51b'); // Default characteristic UUID
    const [availableServices, setAvailableServices] = useState([]);
    const [customZplCode, setCustomZplCode] = useState('^XA^FO0,0^A0,30,30^FDHello, World!^FS^XZ'); // Default custom ZPL code
    const [mtuSize, setMtuSize] = useState(512); // Default MTU size
    const [printingTime, setPrintingTime] = useState(null);

    const handleCustomZplCodeChange = (e) => {
        const newZplCode = e.target.value;
        setCustomZplCode(newZplCode);
    };

    // Function to get available services
    useEffect(() => {
        if (!gattServer) return;

        gattServer.getPrimaryServices()
            .then(services => {
                const uuids = services.map(service => service.uuid);
                setAvailableServices(uuids);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }, [gattServer]);

    const handleServiceUUIDChange = (e) => {
        setServiceUUID(e.target.value);
    };

    const handleCharacteristicUUIDChange = (e) => {
        setCharacteristicUUID(e.target.value);
    };



    const handleMtuSizeChange = (e) => {
        setMtuSize(parseInt(e.target.value));
    };

    const discoverServices = async () => {
        try {
            if (!gattServer) {
                setErrorMessage('Not connected to GATT server');
                return;
            }

            // Get available service UUIDs
            const services = await gattServer.getPrimaryServices();
            const uuids = services.map(service => service.uuid);
            setAvailableServices(uuids);

            setErrorMessage(null); // Clear any previous errors
        } catch (error) {
            setErrorMessage('Failed to discover services: ' + error.message);
        }
    };

    const printZpl = async () => {
        try {
            if (!gattServer) {
                setErrorMessage('Not connected to GATT server');
                return;
            }

            if (!serviceUUID || !characteristicUUID) {
                setErrorMessage('Service UUID and Characteristic UUID are required');
                return;
            }

            let zplCommand = customZplCode;

            // Encode the ZPL command
            const encoder = new TextEncoder('utf-8');
            const data = encoder.encode(zplCommand);

            // Get the selected service and characteristic based on user-entered UUIDs
            const service = await gattServer.getPrimaryService(serviceUUID);
            const characteristic = await service.getCharacteristic(characteristicUUID);

            let maxMTUSize = 512; // Default MTU size
    
            try {
                // Attempt to negotiate MTU size
                if (characteristic.requestMtu) {
                    // Check if the requestMtu function is available
                    maxMTUSize = await characteristic.requestMtu(mtuSize); // Change the MTU size as needed
                    alert(`Max MTU set: ${maxMTUSize}`);
                }
            } catch (mtuError) {
                console.error('MTU negotiation failed:', mtuError);
            }

            // Record the start time
            const startTime = performance.now();
            
            sendChunksSynchronously(data, characteristic, maxMTUSize);

            // Calculate and set the printing time
            const endTime = performance.now();
            const timeElapsed = (endTime - startTime) / 1000; // Convert to seconds
            setPrintingTime(timeElapsed);

            setErrorMessage(null); // Clear any previous errors
        } catch (error) {
            setErrorMessage('Failed to send ZPL command: ' + error.message);
        }
    };

    return (
        <Card>
            <Card.Header as="h5">Print ZPL</Card.Header>
            <Card.Body>
                <Form.Group controlId="serviceUUID">
                    <Form.Label>Service UUID</Form.Label>
                    <Form.Control
                        type="text"
                        value={serviceUUID}
                        onChange={handleServiceUUIDChange}
                        placeholder="Enter the Service UUID"
                    />
                </Form.Group>
                <Form.Group controlId="characteristicUUID">
                    <Form.Label>Characteristic UUID</Form.Label>
                    <Form.Control
                        type="text"
                        value={characteristicUUID}
                        onChange={handleCharacteristicUUIDChange}
                        placeholder="Enter the Characteristic UUID"
                    />
                </Form.Group>
                <div className="mt-3">
                    <Form.Group controlId="customZplCode">
                        <Form.Label>Custom ZPL Code ({<ZplByteSizeCalculator zplCode={customZplCode}/>} bytes)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={customZplCode}
                            onChange={handleCustomZplCodeChange}
                            placeholder="Enter your custom ZPL code here"
                        />
                    </Form.Group>
                </div>
                <Form.Group controlId="mtuSize">
                    <Form.Label>MTU Size</Form.Label>
                    <Form.Control
                        type="number"
                        value={mtuSize}
                        onChange={handleMtuSizeChange}
                        placeholder="Enter the MTU size"
                    />
                </Form.Group>
                <Button onClick={discoverServices} className="m-1">Discover Services</Button>
                <Button onClick={printZpl} className="m-1">Print ZPL</Button>
                {errorMessage && <div className="text-danger">{errorMessage}</div>}

                {printingTime !== null && (
                    <div className="mt-3">
                        <p>Printing Time: {printingTime.toFixed(2)} seconds</p>
                    </div>
                )}

                <div className="mt-3">
                    <p>Available Service UUIDs:</p>
                    <ul>
                        {availableServices.map((uuid, index) => (
                            <li key={index}>{uuid}</li>
                        ))}
                    </ul>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PrintZpl;
