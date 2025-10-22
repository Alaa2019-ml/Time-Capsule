import {
  USER_INTERFACE_ID,
  SELECTED_DATE_ID,
  SELECTED_CITY_ID,
  CURRENT_TIME_ID,
  WIND_SPEED_ID,
  WEATHER_ICON_ID,
  HUMIDITY_ID,
  TEMPERATURE_ID,
  WEATHER_INTERFACE_ID,
} from "../constants.js";
import { createWeatherElement } from "../views/weatherView.js";

import { getHourIn24Format, fetchJson } from "../utils/functions.js";

/**
 * Renders the welcome/start screen
 * - Appends the welcome element to the user interface
 */

export const initWeatherPage = () => {
  const selectedDate = document.getElementById(SELECTED_DATE_ID);
  const selectedCity = document.getElementById(SELECTED_CITY_ID);
  let weatherInterface = document.getElementById(WEATHER_INTERFACE_ID);

  if (!selectedDate.value) {
    console.log("Enter Date Please. ");
    return;
  } else if (!selectedCity.value) {
    console.log("Enter City Please. ");
    return;
  }
  if (!weatherInterface) {
    const main = document.querySelector("main");
    weatherInterface = document.createElement("div");
    weatherInterface.id = WEATHER_INTERFACE_ID;
    main.appendChild(weatherInterface);
  }

  const userInterface = document.getElementById(USER_INTERFACE_ID);

  userInterface.innerHTML = "";
  weatherInterface.innerHTML = "";
  const weatherElement = createWeatherElement();

  weatherInterface.appendChild(weatherElement);

  showWeatherInThePast(selectedCity, selectedDate);
};

const showWeatherInThePast = (city, date) => {
  const cityValue = city.value.trim();
  const modal = document.getElementById("myModal");

  const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityValue}`;

  fetchJson(cityUrl)
    .then((data) => {
      if (!data?.results?.length) {
        throw new Error("City not found, try another one.");
      }
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      const pastWeatherUrl = buildPastWeatherUrl(latitude, longitude, date);
      fetchJson(pastWeatherUrl)
        .then((data) => {
          displayCityWeather(data, cityValue);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => alert(err));
};

const buildPastWeatherUrl = (latitude, longitude, date) => {
  const startDate = date.value.trim();
  const endDate = date.value.trim();

  return `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,windspeed_10m,relative_humidity_2m,precipitation&timezone=auto`;
};

const displayCityWeather = (data, cityName) => {
  const hour = getHourIn24Format();
  const temperature = data.hourly.temperature_2m[hour];
  const windSpeed = data.hourly.windspeed_10m[hour];
  const humidity = data.hourly.relative_humidity_2m[hour];
  const precipitation = data.hourly.precipitation[hour];

  // determine emoji
  let weatherEmoji = "🌤️";
  if (precipitation > 0) weatherEmoji = "🌧️";
  else if (temperature <= 0) weatherEmoji = "❄️";
  else if (temperature > 30) weatherEmoji = "☀️";
  else if (humidity > 80) weatherEmoji = "🌫️";
  else if (windSpeed > 30) weatherEmoji = "🌬️";

  document.getElementById(WEATHER_ICON_ID).textContent = weatherEmoji;
  document.getElementById(CURRENT_TIME_ID).textContent = `Time: ${hour}:00`;
  document.getElementById(
    TEMPERATURE_ID
  ).textContent = `${cityName} ${temperature}°C`;
  document.getElementById(
    WIND_SPEED_ID
  ).textContent = `Wind Speed: ${windSpeed} km/h`;
  document.getElementById(HUMIDITY_ID).textContent = `Humidity: ${humidity}%`;
};
