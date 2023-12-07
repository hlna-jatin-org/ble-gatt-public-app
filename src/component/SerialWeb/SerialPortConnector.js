import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

function SerialPortConnector() {
  const [port, setPort] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('');
  const [commandInput, setCommandInput] = useState('');
  const [responseText, setResponseText] = useState('');

  const connectToSerial = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: 9600 });
      setPort(port);
      setConnectionStatus('Connected to Serial Port');
    } catch (error) {
      console.error('Serial port connection error:', error);
    }
  };

  const stopConnection = async () => {
    if (port) {
      await port.close();
      setPort(null);
      setConnectionStatus('Serial Port Connection Closed');
    }
  };

  const sendCommand = async () => {
    if (port && port.writable) {
      const writer = port.writable.getWriter();
      try {
        await writer.write(commandInput);
      } catch (error) {
        console.error('Error writing to serial port:', error);
      } finally {
        writer.releaseLock();
      }
    }
  };

  useEffect(() => {
    if (port) {
      port.addEventListener('input', (event) => {
        const data = event.data;
        setResponseText((prevText) => prevText + data);
      });
    }
  }, [port]);

  return (
    <div>
      <h3>Serial Port Communication</h3>
      {port ? (
        <Button onClick={stopConnection}>Stop Connection</Button>
      ) : (
        <Button onClick={connectToSerial}>Scan & Connect Serial Port</Button>
      )}
      <div>{port && JSON.stringify(port.getInfo())}</div>

      <div id="connectionStatus">{connectionStatus}</div>

        {
          port && 
          <div
            id="commandArea"
            style={{
              display: connectionStatus ? 'flex' : 'none',
              flexDirection: 'column',
              margin: '20px',
              padding: '10px',
            }}
          >
          <textarea
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="Enter your command"
          />
          <Button style={{ margin: '10px' }} onClick={sendCommand}>
            Send Command
          </Button>
          </div>
      }
      
      <div id="responseArea" style={{ display: responseText ? 'block' : 'none' }}>
        <div>Response:</div>
        <pre>{responseText}</pre>
      </div>
    </div>
  );
}

export default SerialPortConnector;
