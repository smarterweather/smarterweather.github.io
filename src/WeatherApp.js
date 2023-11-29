import './WeatherApp.css';

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const WeatherApp = () => {
    const location = useLocation();
    const { latitude, longitude } = location.state || {};
    const [weatherData, setWeatherData] = useState({ issuingOffice: '', issuanceTime: '', productText: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryNWS = async (url) => {
        return await fetch(`${url}`, {
            headers: {
                "User-Agent": "smarterweather.com (smarterweather@gmail.com)"
            }
        })
    }

    // Function to fetch NWS Office using coordinates
    const fetchNWSOffice = async (latitude, longitude) => {
        const response = await queryNWS(`https://api.weather.gov/points/${latitude},${longitude}`);
        if (!response.ok) {
            throw new Error('Failed to fetch NWS Office');
        }
        const data = await response.json();
        return data.properties.cwa;
    };

    // Function to fetch the latest area forecast discussion
    const fetchForecastDiscussion = async (cwa) => {
        const response = await queryNWS(`https://api.weather.gov/products/types/AFD/locations/${cwa}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Forecast Discussion');
        }
        const data = await response.json();
        const latestDiscussionId = data['@graph'][0].id;
        const forecastResponse = await queryNWS(`https://api.weather.gov/products/${latestDiscussionId}`);
        const forecastData = await forecastResponse.json();
        return forecastData;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (latitude && longitude) {
                    const cwa = await fetchNWSOffice(latitude, longitude);
                    // const cwa = await fetchNWSOffice(42.766997269347996, -78.6954896010572)
                    const forecastData = await fetchForecastDiscussion(cwa);
                    setWeatherData({
                        issuingOffice: forecastData.issuingOffice,
                        issuanceTime: new Date(forecastData.issuanceTime).toLocaleString(),
                        productText: forecastData.productText
                    });
                    setIsLoading(false);
                }
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchData();
    });

    return (
    <div className="weather-container">
        {isLoading ? (
        <p className="loading-error">Loading...</p>
        ) : error ? (
        <p className="loading-error">Error: {error}</p>
        ) : (
        <div>
            <h1 className="weather-header">Weather Forecast Discussion</h1>
            <p className="weather-info"><strong>Forecast Office:</strong> {weatherData.issuingOffice}</p>
            <p className="weather-info"><strong>Last Updated:</strong> {weatherData.issuanceTime}</p>
            <pre className="weather-content">{weatherData.productText}</pre>
        </div>
        )}
    </div>
    );
};

export default WeatherApp;
