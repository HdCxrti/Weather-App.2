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
  // fetchForecast(city, 7);
  const url = `http://192.168.4.28:8088/system/webdev/samplequickstart/API/forecast.json?q=${city}&days=7&aqi=no&alerts=no`;

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
  const url =
    `http://192.168.4.28:8088/system/webdev/samplequickstart/API/forecast.json` +
    `?q=${encodeURIComponent(city)}&days=${days}&aqi=no&alerts=no`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      updateWeatherCard();

      data.forecast.forecastday.forEach((day, i) => {
        const slot = document.getElementById(`day${i + 1}`);
        if (!slot) return;

        slot.innerHTML = `
          <h4>${day.date}</h4>
          <p>${day.day.avgtemp_f.toFixed(1)}°F – ${day.day.condition.text}</p>
          <img src="https:${day.day.condition.icon}" alt="${
          day.day.condition.text
        }" />
        `;
      });
    })
    .catch((err) => console.error(err));
}

document.getElementById("current-btn").addEventListener("click", () => {
  if (data.location) {
    updateWeatherCard();
  }
});

document.getElementById("three-day-btn").addEventListener("click", () => {
  if (data.location) {
    fetchForecast(data.location.name, 3);
    console.log(data.location.name);
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
