const countriesContainer = document.getElementById("countriesContainer");
const weatherContainer = document.getElementById("weatherContainer");
const countryInput = document.getElementById("countryInput");
const searchBtn = document.getElementById("searchBtn");

// Search and fetch country data
searchBtn.addEventListener("click", () => {
    const country = countryInput.value.trim();
    countryInput.value = "";

    if (!country) {
        alert("Please enter a country name!");
        return;
    }

    const countryAPI = `https://restcountries.com/v3.1/name/${country}`;
    fetch(countryAPI)
        .then(response => response.json())
        .then(data => {
            if (!data || data.status === 404) {
                alert("Country not found!");
                return;
            }
            renderCountries(data);
        })
        .catch(error => console.error("Error fetching country data:", error));
});

// Render country cards
function renderCountries(countries) {
    countriesContainer.innerHTML = "";
    weatherContainer.innerHTML = "";

    countries.forEach(country => {
        const countryCard = document.createElement("div");
        countryCard.classList.add("country-card");

        countryCard.innerHTML = `
            <img src="${country.flags.png}" alt="${country.name.common}" class="img-fluid mb-3">
            <h5>${country.name.common}</h5>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Currency:</strong> ${
                Object.values(country.currencies)[0].name
            } (${Object.values(country.currencies)[0].symbol})</p>
            <button class="btn btn-dark mt-3" onclick="fetchWeather('${country.latlng[0]}', '${country.latlng[1]}', '${country.name.common}')">View Weather</button>
        `;

        countriesContainer.appendChild(countryCard);
    });
}

// Fetch weather data and render
function fetchWeather(lat, lon, countryName) {
    const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(weatherAPI)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("weather-card");

            weatherCard.innerHTML = `
                <h5>Weather in ${countryName}</h5>
                <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
                <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
                <p><strong>Condition:</strong> ${
                    weather.weathercode || "N/A"
                }</p>
            `;

            weatherContainer.appendChild(weatherCard);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Unable to fetch weather data. Please try again later.");
        });
}