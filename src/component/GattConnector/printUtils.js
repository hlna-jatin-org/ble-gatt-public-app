export async function sendChunksAsynchronously(data, characteristic, maxMTUSize) {
    for (let offset = 0; offset < data.byteLength; offset += maxMTUSize) {
      const chunk = data.slice(offset, offset + maxMTUSize);
      await characteristic.writeValue(chunk);
    }
  }

export async function sendChunksSynchronously(data, characteristic, maxMTUSize) {
    for (let offset = 0; offset < data.byteLength; offset += maxMTUSize) {
      const chunk = data.slice(offset, offset + maxMTUSize);
      
      try {
        // Send the ZPL command chunk to the characteristic
        await characteristic.writeValue(chunk);
        
        // Wait for acknowledgment (ACK) from the printer before sending the next chunk
        await waitForAcknowledgment(characteristic);
      } catch (error) {
        // Handle errors, including timeouts and NACKs
        console.error('Error sending fragment:', error);
        throw error; // You may want to propagate the error further if needed
      }
    }
  }
  
async function waitForAcknowledgment(characteristic) {
return new Promise((resolve, reject) => {
    // Implement logic to wait for an acknowledgment (ACK)
    // This might involve setting up event listeners or polling for ACK
    const timeout = 10000; // Set a reasonable timeout
    
    // Example: Polling for ACK every 100ms
    const pollInterval = 100;
    const startTime = Date.now();

    const pollForAck = async () => {
    try {
        // Check if acknowledgment (ACK) is received from the printer
        const value = await characteristic.readValue(); // Use the appropriate method to read data

        if (value === 'ACK') {
        resolve(); // ACK received, resolve the Promise
        } else {
        // Continue polling until ACK or timeout
        if (Date.now() - startTime >= timeout) {
            reject(new Error('Timeout waiting for acknowledgment')); // Timeout reached
        } else {
            setTimeout(pollForAck, pollInterval);
        }
        }
    } catch (error) {
        reject(error); // Handle read errors
    }
    };

    // Start polling for ACK
    pollForAck();
});
}  

// send fragments for acknowledgement
// function chunkString(str, size) {
//     const chunks = [];
//     for (let i = 0; i < str.length; i += size) {
//       chunks.push(str.slice(i, i + size));
//     }
//     return chunks;
//   }

// async function sendFragmentToPrinter(fragment) {
//   return new Promise((resolve, reject) => {
//     // Use your BLE library to send the fragment
//     // Adjust the parameters and method based on your BLE library's API
//     bleLibrary.sendData(fragment, (response) => {
//       // Check for a successful response from the printer
//       if (response === 'ACK') {
//         resolve(); // Fragment sent and acknowledged
//       } else {
//         reject(new Error('Failed to send fragment or received NACK')); // Handle NACK or other errors
//       }
//     });
//   });
// }

// async function waitForAcknowledgment() {
//   return new Promise((resolve, reject) => {
//     const acknowledgmentTimeout = 5000; // Set a timeout for waiting for acknowledgment (adjust as needed)
//     let acknowledgmentReceived = false;

//     // Implement logic to wait for an acknowledgment (ACK)
//     // This might involve setting up event listeners or polling for ACK

//     // Example: Polling for ACK every 100ms
//     const pollInterval = 100;
//     const startTime = Date.now();

//     const pollForAck = () => {
//       // Check if acknowledgment has been received
//       if (acknowledgmentReceived) {
//         resolve(); // Acknowledgment received
//       } else if (Date.now() - startTime >= acknowledgmentTimeout) {
//         reject(new Error('Timeout waiting for acknowledgment')); // Timeout reached
//       } else {
//         // Continue polling until ACK or timeout
//         setTimeout(pollForAck, pollInterval);
//       }
//     };

//     // Start polling for ACK
//     pollForAck();
//   });
// }
