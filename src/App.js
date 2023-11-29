// App.js
import React from 'react';
import './App.css';
import WeatherApp from './WeatherApp'; // Import the WeatherApp component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <WeatherApp /> {/* Use the WeatherApp component */}
      </header>
    </div>
  );
}

export default App;
