BASE_URL = "https://api.openweathermap.org/data/2.5";
API_KEY = "e27371ed2c0abc5f7c1fc5ea1862e758";
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getWeatherData = async (type, data) => {
  let url = null;

  switch (type) {
    case "current":
      if (typeof data === "string") {
        url = `${BASE_URL}/weather?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    case "forecast":
      if (typeof data === "string") {
        url = `${BASE_URL}/forecast?q=${data}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${BASE_URL}/forecast?lat=${data.latitude}&lon=${data.longitude}&appid=${API_KEY}&units=metric`;
      }
      break;
    default:
      url = `${BASE_URL}/weather?q=mashhad&appid=${API_KEY}&units=metric`;
      break;
  }

  try {
    const response = await fetch(url);
    const json = await response.json();
    if (+json.cod === 200) {
      return json;
    } else {
      showModal(json.message);
    }
  } catch (error) {
    showModal("An error occured when fetching data");
  }
};

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
const weatherContainer = document.getElementById("weather");
const forecastContainer = document.getElementById("forecast");
const locationIcon = document.getElementById("location");
const modal = document.getElementById("modal");
const modalText = document.querySelector("p");
const modalButton = document.getElementById("modal-button");

const renderCurrentWeather = (data) => {
  if (!data) return;
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

const getWeekDay = (date) => {
  return DAYS[new Date(date * 1000).getDay()];
};

const renderForecastWeather = (data) => {
  if (!data) return;
  forecastContainer.innerHTML = "";
  data = data.list.filter((obj) => obj.dt_txt.endsWith("12:00:00"));

  data.forEach((i) => {
    const forecastJSX = `
      <div>
        <img src="http://openweathermap.org/img/w/${
          i.weather[0].icon
        }.png" alt="weather icon"/>
        <h3>${getWeekDay(i.dt)}</h3>
        <p>${Math.round(i.main.temp)} °C</p>
        <span>${i.weather[0].main}</span>
      </div>
    `;
    forecastContainer.innerHTML += forecastJSX;
  });
};

const searchHandler = async () => {
  const cityName = searchInput.value;

  if (!cityName) {
    showModal("Please enter city name!");
  }

  const currentData = await getWeatherData("current", cityName);
  renderCurrentWeather(currentData);
  const forecastData = await getWeatherData("forecast", cityName);
  renderForecastWeather(forecastData);
};

const positionCallback = async (position) => {
  const currentData = await getWeatherData("current", position.coords);
  renderCurrentWeather(currentData);

  const forecastData = await getWeatherData("forecast", position.coords);

  renderForecastWeather(forecastData);
};

const errorCallback = (error) => {
  showModal(error.message);
};

const locationHandler = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(positionCallback, errorCallback);
  } else {
    showModal("Your browser dose not support geolocation");
  }
};

// modal

const showModal = (text) => {
  modalText.innerText = text;
  modal.style.display = "flex";
};

const removeModal = () => {
  modal.style.display = "none";
};

searchButton.addEventListener("click", searchHandler);
locationIcon.addEventListener("click", locationHandler);
modalButton.addEventListener("click", removeModal);
