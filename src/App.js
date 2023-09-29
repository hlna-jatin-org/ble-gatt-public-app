import logo from './logo.svg';
import './App.css';
import DeviceScanner from './component/DeviceScanner';

function App() {
  return (
    <div className="App">
      <h4>BLE GATT App</h4>
      <DeviceScanner></DeviceScanner>
    </div>
  );
}

export default App;
