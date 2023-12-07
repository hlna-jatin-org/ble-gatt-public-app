// npm install express
// npm install web-bluetooth

const express = require('express');
const app = express();
const PORT = 3100;

// Import the Web Bluetooth API for Node.js
const { BluetoothDevice } = require('web-bluetooth');

// Middleware to enable CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Define an endpoint to list printer service UUIDs
app.get('/printer-services', async (req, res) => {
  try {
    // Request Bluetooth device
    const device = await BluetoothDevice.requestDevice({ filters: [{ services: [ '38eb4a80-c570-11e3-9507-0002a5d5c51b'] }] });

    // Connect to the device
    await device.gatt.connect();

    // Get the list of GATT services
    const services = device.gatt.getPrimaryServices();

    // Extract and send the UUIDs of the services
    const serviceUUIDs = services.map((service) => service.uuid);

    // Disconnect from the device
    await device.gatt.disconnect();

    // Send the service UUIDs as a JSON response
    res.json(serviceUUIDs);
  } catch (error) {
    console.error('Bluetooth error:', error);
    res.status(500).json({ error: 'Failed to retrieve printer services.' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
