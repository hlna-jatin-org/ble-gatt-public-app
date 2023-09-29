import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import ErrorHandler from './ErrorHandler';
import PrintZpl from './PrintZpl';

const Device = ({ device }) => {
    const [gattServer, setGattServer] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        if (gattServer){
            setLoading(false);
            console.log("Gatt server connected...")
            console.log(gattServer);
        }

    }, [gattServer])

    const connectToDevice = () => {
        setLoading(true)

        if (!device.gatt) {
            setLoading(false);
            setErrorMessage('Device does not support Bluetooth GATT');
            return;
        }

        device.gatt.connect()
        .then(server => {
            setLoading(false);
            setGattServer(server);
        })
        .catch(error => {
            setLoading(false);
            setErrorMessage('Failed to connect to GATT server: ' + error.message);
        });
    };

    return (
        <Card className="m-3 w-50">
            <Card.Header as="h5">
            <ErrorHandler error={errorMessage} setError={setErrorMessage} />

                <Row>
                    <Col>
                        {device.name ? device.name : "Unnamed Device"}
                        <br></br>
                        {device.id}
                    </Col>
                    
                    <Col>
                    {device.gatt.connected ? <Card.Text>Status: Connected</Card.Text> : <Card.Text>Status: Disconnected</Card.Text>}
                    </Col>

                <Col className="text-right">
                    {loading ? "connecting...": <Button variant="primary" onClick={connectToDevice} className="m-1">Connect</Button>}
                </Col>

                </Row>
            </Card.Header>

            <Card.Body className='m-2'>
                {gattServer && (
                    <PrintZpl gattServer={gattServer} />)}
            </Card.Body>
            
        </Card>
    );
};

export default Device;
