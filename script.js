const button = document.getElementById("search-button");
button.addEventListener("click", function () {
  console.log("Button clicked!");
  const city = document.getElementById("city-input").value.trim();
  console.log(city);
  if (!city) {
    alert("Please enter a city name");
    return;
  }
  const url = `https://api.weatherapi.com/v1/current.json?key=075afc9c7dbb487ab8f133712251305&q=${city}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const weatherbox = document.getElementById("weather-box");

      weatherbox.innerHTML = `
  <h2>${data.location.name}</h2>
  <p><strong>${data.current.temp_f}°F</strong> - ${data.current.condition.text}</p>
  <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}">

`;
    });
});
