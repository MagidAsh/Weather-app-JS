BASE_URL = "https://api.openweathermap.org/data/2.5";

API_KEY = "e27371ed2c0abc5f7c1fc5ea1862e758";

searchInput = document.querySelector("input");
searchButton = document.querySelector("button");
weatherContainer = document.getElementById("weather");

const getCurrentWeatherByName = async (city) => {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

renderCurrentWeather = (data) => {
  // console.log(data);

  const weatherJSX = `
    <h1>${data.name}, ${data.sys.country}</h1>
    <div id="main">
      <img src="http://openweathermap.org/img/w/${
        data.weather[0].icon
      }.png" alt="weather icon"/>
      <span>${data.weather[0].main}</span>
      <p>${Math.round(data.main.temp)} °C</p>
    </div>
    <div id="info">
      <p>Humidity: <span>${data.main.humidity} %</span></p>
      <p>Wind Speed: <span>${data.wind.speed} m/s</span></p>
    </div>
  `;

  weatherContainer.innerHTML = weatherJSX;
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    alert("Please enter city name!");
  }

  const currentData = await getCurrentWeatherByName(cityName);
  renderCurrentWeather(currentData);
};

searchButton.addEventListener("click", searchHandler);
