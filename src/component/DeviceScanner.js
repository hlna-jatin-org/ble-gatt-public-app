import React, { useState } from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import Device from './GattDevice';

const DeviceScanner = () => {
    const [devices, setDevices] = useState([]);

    const scanDevices = () => {
        navigator.bluetooth.requestDevice({
            acceptAllDevices: true
        })
        .then(device => {
            setDevices(prevDevices => [...prevDevices, device]);
        })
        .catch(error => {
            console.error(error);
        });
    }

    return (
        <div className="d-flex flex-column align-items-center">
        <Button onClick={scanDevices} className="m-1">Scan</Button>
        <ListGroup className="w-100">
            {devices.map((device, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-center">
                    <Device device={device} />
                </ListGroup.Item>
            ))}
        </ListGroup>
    </div>
    );
}

export default DeviceScanner;
