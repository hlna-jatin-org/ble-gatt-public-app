const express = require('express');
const app = express();
const btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort();

// replace with your printer's Bluetooth address
const printerAddress = '00:00:00:00:00:00'; 

app.post('/print', (req, res) => {
    const { zpl } = req.body;

    btSerial.findSerialPortChannel(printerAddress, (channel) => {
        btSerial.connect(printerAddress, channel, () => {
            btSerial.write(new Buffer(zpl, 'utf-8'), (err, bytesWritten) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(200).send(`Printed ${bytesWritten} bytes`);
                }
                btSerial.close();
            });
        }, () => res.status(500).send('Cannot connect'));
    }, () => res.status(500).send('Cannot find the printer'));
});

app.listen(3000, () => console.log('Server listening on port 3000'));
