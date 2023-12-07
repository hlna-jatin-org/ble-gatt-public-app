import logo from './logo.svg';
import './App.css';
import DeviceScanner from './component/GattConnector/DeviceScanner';
import SerialPortConnector from './component/SerialWeb/SerialPortConnector';


function App() {
  return (
    <div className="App">
      <h5>BLE App v1.1 (Asynchronous Print)+(serial connection)</h5>
      <hr></hr>
      <div style={{display: "flex", flexDirection:"row", height:"100vh"}}>
        <div style={{width: "50vw",  borderRight:"3px dashed black"}}>
          <h4>BLE GATT App </h4>
          <DeviceScanner></DeviceScanner>
        </div>

        <div style={{width: "50vw"}}>
          <SerialPortConnector></SerialPortConnector>
        </div>
      </div>
    </div>
  );
}

export default App;
