document.getElementById('city').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
});

async function getWeather() {
    const apiKey = 'b69b18ba6e2ff211e1238047fa45e4ad'; // In a real app, use environment variables
    const city = document.getElementById('city').value.trim();
    const errorDiv = document.getElementById('error');
    const weatherContent = document.getElementById('weather-content');

    if (!city) {
        errorDiv.textContent = 'Please enter a city';
        return;
    }

    errorDiv.textContent = '';
    
    try {
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        const [weatherResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();

        if (weatherData.cod !== 200) {
            throw new Error(weatherData.message);
        }

        displayWeather(weatherData);
        displayHourlyForecast(forecastData.list);
        weatherContent.classList.remove('hidden');
    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
        weatherContent.classList.add('hidden');
    }
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherInfo = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = description;
    
    tempDiv.textContent = `${temperature}°C`;
    weatherInfo.innerHTML = `
        <p>${data.name}</p>
        <p style="text-transform: capitalize">${description}</p>
    `;
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    hourlyForecast.innerHTML = '';

    const next24Hours = hourlyData.slice(0, 8); // Next 24 hours in 3-hour intervals

    next24Hours.forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        const temp = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        
        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <span>${hour}:00</span>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${item.weather[0].description}">
            <span>${temp}°C</span>
        `;
        
        hourlyForecast.appendChild(hourlyItem);
    });
}