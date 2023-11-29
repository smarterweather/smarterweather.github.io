import './HomePage.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaLocationArrow } from 'react-icons/fa';

const HomePage = () => {
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent default form submission behaviour

    const response = await fetch(`https://geocode.xyz/?locate=${encodeURIComponent(input)}&geoit=json&region=NorthAmerica`);
    if (!response.ok) {
        throw new Error('Failed to find results');
    }
    const data = await response.json();
    if (!data.hasOwnProperty('error') && data.hasOwnProperty('latt') && data.hasOwnProperty('longt')) {
        const latitude = data.latt;
        const longitude = data.longt;
        navigate('/weather', { state: { latitude, longitude } });
    } else {
        throw new Error('Failed to find results');
    }
  };

  const handleLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        navigate('/weather', { state: { latitude, longitude } });
      },
      (error) => {
        console.error("Error getting the location: ", error);
        // Optionally set error state here and display an error message to the user
      }
    );
  };

  return (
    <div className="body-container">
      <form className="search-container" onSubmit={handleSearch}>
        <FaSearch className="search-icon" />
        <input
          className="search-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter City or Zip Code"
        />
        <button type="submit" className="icon-button" aria-label="Search">
          <FaSearch />
        </button>
        <button type="button" className="icon-button" onClick={handleLocation} aria-label="Use my location">
          <FaLocationArrow />
        </button>
      </form>
    </div>
  );
};

export default HomePage;
