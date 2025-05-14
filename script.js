let isCelsius = false;
let data = {};

function convertTemp(tempF) {
  return isCelsius ? ((tempF - 32) * 5) / 9 : tempF;
}

function updateWeatherCard() {
  const temp = isCelsius
    ? convertTemp(data.current.temp_f)
    : data.current.temp_f;
  const feelsLike = isCelsius
    ? convertTemp(data.current.feelslike_f)
    : data.current.feelslike_f;
  const condition = data.current.condition.text;
  const humidity = data.current.humidity;
  const windSpeed = data.current.wind_kph;
  const pressure = data.current.pressure_mb;
  const sunrise = data.forecast.forecastday[0].astro.sunrise;
  const sunset = data.forecast.forecastday[0].astro.sunset;

  const iconUrl = `https:${data.current.condition.icon}`;

  document.getElementById("weather-box").innerHTML = `
    <div class="weather-card">
      <h2>${data.location.name}</h2>
      <p><strong>${temp.toFixed(1)}°${
    isCelsius ? "C" : "F"
  }</strong> – ${condition}</p>
      <img src="${iconUrl}" alt="${condition}">
      <p>Feels like: ${feelsLike.toFixed(1)}°${isCelsius ? "C" : "F"}</p>
      <div id="details">
        <p><strong>Humidity:</strong> ${humidity}%</p>
        <p><strong>Wind Speed:</strong> ${windSpeed} km/h</p>
        <p><strong>Pressure:</strong> ${pressure} hPa</p>
        <p><strong>Sunrise:</strong> ${sunrise}</p>
        <p><strong>Sunset:</strong> ${sunset}</p>
      </div>
    </div>
  `;
}

document.getElementById("unit-toggle").addEventListener("click", () => {
  isCelsius = !isCelsius;
  document.getElementById("unit-toggle").innerText = isCelsius
    ? "Switch to °F"
    : "Switch to °C";
  updateWeatherCard();
});

document.getElementById("search-button").addEventListener("click", () => {
  const city = document.getElementById("city-input").value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  const url = `https://api.weatherapi.com/v1/forecast.json?key=075afc9c7dbb487ab8f133712251305&q=${city}&days=7`;

  fetch(url)
    .then((response) => response.json())
    .then((fetchedData) => {
      data = fetchedData;
      updateWeatherCard();
    })
    .catch((error) => {
      console.error("Error fetching data: ", error);
      alert("Unable to fetch weather data.");
    });
});

function fetchForecast(city, days) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=075afc9c7dbb487ab8f133712251305&q=${city}&days=${days}`;

  fetch(url)
    .then((res) => res.json())
    .then((fetchedData) => {
      const weatherbox = document.getElementById("weather-box");
      weatherbox.innerHTML = fetchedData.forecast.forecastday
        .map(
          (day) => `
        <div class="forecast-day">
          <h4>${day.date}</h4>
          <p>${day.day.avgtemp_f}°F – ${day.day.condition.text}</p>
          <img src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
        </div>
      `
        )
        .join("");
    });
}

document.getElementById("current-btn").addEventListener("click", () => {
  if (data.location) {
    updateWeatherCard();
  }
});

document.getElementById("three-day-btn").addEventListener("click", () => {
  if (data.location) {
    fetchForecast(data.location.name, 3);
  }
});

document.getElementById("seven-day-btn").addEventListener("click", () => {
  if (data.location) {
    fetchForecast(data.location.name, 7);
  }
});
const dmToggle = document.getElementById("dark-mode-toggle");
dmToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", dmToggle.checked);
});
