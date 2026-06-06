// OpenWeatherMap API Key
const API_KEY = 'b6fd43b5a25b55b6c9c0947b427c0e6d';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const weatherSection = document.getElementById('weatherSection');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');

// Event Listeners
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    }
});

locationBtn.addEventListener('click', getWeatherByLocation);

// Get Weather by City Name
async function getWeatherByCity(city) {
    try {
        showLoading(true);
        clearError();
        
        const response = await fetch(
            `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=sq`
        );
        
        if (!response.ok) {
            throw new Error('Qyteti nuk u gjet!');
        }
        
        const data = await response.json();
        await getForecast(data.coord.lat, data.coord.lon);
        displayWeather(data);
        
    } catch (error) {
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// Get Weather by Current Location
function getWeatherByLocation() {
    if (!navigator.geolocation) {
        showError('Geolocimi nuk suportohet në shfletuesin tuaj!');
        return;
    }
    
    showLoading(true);
    clearError();
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(
                    `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=sq`
                );
                
                const data = await response.json();
                await getForecast(latitude, longitude);
                displayWeather(data);
                
            } catch (error) {
                showError('Gabim në ngarkimin e të dhënave të motit!');
            } finally {
                showLoading(false);
            }
        },
        (error) => {
            showError('Nuk mund të aksesojmë lokacionin tuaj!');
            showLoading(false);
        }
    );
}

// Get 5-Day Forecast
async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=sq`
        );
        
        const data = await response.json();
        displayForecast(data.list);
        
    } catch (error) {
        console.error('Gabim në ngarkimin e parashikimit:', error);
    }
}

// Display Current Weather
function displayWeather(data) {
    // City and Date
    document.getElementById('cityName').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('sq-AL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Temperature
    document.getElementById('temperature').textContent = Math.round(data.main.temp);
    
    // Weather Icon
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    document.getElementById('weatherIcon').src = iconUrl;
    
    // Description
    document.getElementById('weatherDesc').textContent = data.weather[0].main;
    
    // Details
    document.getElementById('windSpeed').textContent = `${Math.round(data.wind.speed)} m/s`;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('feelsLike').textContent = `${Math.round(data.main.feels_like)}°C`;
    document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
    
    // Show weather section
    weatherSection.style.display = 'block';
}

// Display 5-Day Forecast
function displayForecast(list) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';
    
    // Get forecast for next 5 days (every 24 hours)
    const forecasts = [];
    const seenDates = new Set();
    
    list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('sq-AL');
        if (!seenDates.has(date) && forecasts.length < 5) {
            seenDates.add(date);
            forecasts.push(item);
        }
    });
    
    forecasts.forEach(forecast => {
        const card = createForecastCard(forecast);
        forecastGrid.appendChild(card);
    });
}

// Create Forecast Card
function createForecastCard(forecast) {
    const card = document.createElement('div');
    card.className = 'forecast-card';
    
    const date = new Date(forecast.dt * 1000);
    const dateStr = date.toLocaleDateString('sq-AL', { weekday: 'short', month: 'short', day: 'numeric' });
    const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;
    
    card.innerHTML = `
        <div class="forecast-date">${dateStr}</div>
        <div class="forecast-icon">
            <img src="${iconUrl}" alt="${forecast.weather[0].main}">
        </div>
        <div class="forecast-temp">
            <span class="forecast-temp-max">${Math.round(forecast.main.temp_max)}°</span>
            <span class="forecast-temp-min">${Math.round(forecast.main.temp_min)}°</span>
        </div>
        <div class="forecast-desc">${forecast.weather[0].main}</div>
    `;
    
    return card;
}

// Helper Functions
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    weatherSection.style.display = 'none';
}

function clearError() {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
}

// Load default weather on page load
window.addEventListener('load', () => {
    // Try to get user's location on load
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=sq`
                    );
                    
                    const data = await response.json();
                    await getForecast(latitude, longitude);
                    displayWeather(data);
                    
                } catch (error) {
                    // Silent fail - user can search manually
                }
            }
        );
    }
});
