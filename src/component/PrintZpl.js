import React, { useState, useEffect } from 'react';
import { Button, Form, Card } from 'react-bootstrap';
import ErrorHandler from './ErrorHandler';

const PrintZpl = ({ gattServer }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCharacteristic, setSelectedCharacteristic] = useState(null);

    useEffect(() => {
        if (!gattServer) {
            setErrorMessage('Not connected to GATT server');
            return;
        }

        gattServer.getPrimaryServices()
            .then(servicesData => {
                setServices(servicesData);
            })
            .catch(error => {
                setErrorMessage('Failed to get services and characteristics: ' + error.message);
            });
            
    }, [gattServer]);

    const printZpl = () => {
        if (!gattServer || !selectedService || !selectedCharacteristic) {
            setErrorMessage('Not connected to GATT server or service/characteristic not selected');
            return;
        }

        const zpl = '^XA^FO0,0^A0,30,30^FDHello, Supplier Label App^FS^XZ';
        const encoder = new TextEncoder('utf-8');
        const data = encoder.encode(zpl);

        selectedService.getCharacteristic(selectedCharacteristic)
            .then(characteristic => characteristic.writeValue(data))
            .catch(error => {
                setErrorMessage('Failed to send ZPL command: ' + error.message);
            });
    };

    return (
        <Card className="m-3">
            <Card.Header as="h5"> Select Service 
            <ErrorHandler error={errorMessage} setError={setErrorMessage} />
            </Card.Header>
            
            <Card.Body>
                <Form>
                    <Form.Group controlId="serviceSelect">
                        <Form.Label>Select Service</Form.Label>
                        <Form.Control as="select" onChange={e => setSelectedService(e.target.value)}>
                            {services.map(service => (
                                <option key={service.uuid} value={service.uuid}>{service.uuid}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {selectedService && (
                        <Form.Group controlId="characteristicSelect">
                            <Form.Label>Select Characteristic</Form.Label>
                            <Form.Control as="select" onChange={e => setSelectedCharacteristic(e.target.value)}>
                                {selectedService.getCharacteristics().map(characteristic => (
                                    <option key={characteristic.uuid} value={characteristic.uuid}>{characteristic.uuid}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                </Form>

                <Button onClick={printZpl} className="m-1">Print ZPL</Button>
                
            </Card.Body>
        </Card>
    );
};

export default PrintZpl;
