import './WeatherApp.css';

import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState({ issuingOffice: '', issuanceTime: '', productText: '' });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to get user's GPS coordinates
    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser'));
            } else {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            }
        });
    };

    // Function to fetch NWS Office using coordinates
    const fetchNWSOffice = async (latitude, longitude) => {
        const response = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
        if (!response.ok) {
            throw new Error('Failed to fetch NWS Office');
        }
        const data = await response.json();
        return data.properties.cwa;
    };

    // Function to fetch the latest area forecast discussion
    const fetchForecastDiscussion = async (cwa) => {
        const response = await fetch(`https://api.weather.gov/products/types/AFD/locations/${cwa}`);
        if (!response.ok) {
            throw new Error('Failed to fetch Forecast Discussion');
        }
        const data = await response.json();
        const latestDiscussionId = data['@graph'][0].id;
        const forecastResponse = await fetch(`https://api.weather.gov/products/${latestDiscussionId}`);
        const forecastData = await forecastResponse.json();
        return forecastData;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const location = await getLocation();
                const cwa = await fetchNWSOffice(location.coords.latitude, location.coords.longitude);
                // const cwa = await fetchNWSOffice(42.766997269347996, -78.6954896010572)
                const forecastData = await fetchForecastDiscussion(cwa);
                setWeatherData({
                    issuingOffice: forecastData.issuingOffice,
                    issuanceTime: new Date(forecastData.issuanceTime).toLocaleString(),
                    productText: forecastData.productText
                });
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <div>
                    <h1>Weather Forecast Discussion</h1>
                    <p><strong>Forecast Office:</strong> {weatherData.issuingOffice}</p>
                    <p><strong>Last Updated:</strong> {weatherData.issuanceTime}</p>
                    <pre className="product-text">{weatherData.productText}</pre>
                </div>
            )}
        </div>
    );
};

export default WeatherApp;
