import {
  USER_INTERFACE_ID,
  SELECTED_DATE_ID,
  SELECTED_CITY_ID,
  CURRENT_TIME_ID,
  WIND_SPEED_ID,
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
    // console.warn("WEATHER_INTERFACE_ID not found in DOM.");
    // return;
  }

  const userInterface = document.getElementById(USER_INTERFACE_ID);

  userInterface.innerHTML = "";
  weatherInterface.innerHTML = "";
  const weatherElement = createWeatherElement();
  // userInterface.appendChild(weatherElement);

  weatherInterface.appendChild(weatherElement);
  weatherInterface.style.display = "block";

  //but before calling the weather page, we need to get the data
  showWeatherInThePast(selectedCity, selectedDate);
};

// bnefore we call the functions we want to check the dom

const showWeatherInThePast = (city, date) => {
  const cityUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city.value}`;

  fetchJson(cityUrl)
    .then((data) => {
      const latitude = data.results[0].latitude;
      const longitude = data.results[0].longitude;
      const pastWeatherUrl = buildPastWeatherUrl(latitude, longitude, date);
      fetchJson(pastWeatherUrl).then((data) => {
        displayCityWeather(data);
      });
    })
    .catch((err) => console.log(err));
};

const buildPastWeatherUrl = (latitude, longitude, date) => {
  const startDate = date.value.trim();
  const endDate = date.value.trim();

  return `https://archive-api.open-meteo.com/v1/era5?latitude=${latitude}&longitude=${longitude}&start_date=${startDate}&end_date=${endDate}&hourly=temperature_2m,windspeed_10m,relative_humidity_2m,precipitation&timezone=auto`;
};

const displayCityWeather = (data) => {
  const hour = getHourIn24Format();
  const temperature = data.hourly.temperature_2m[hour];
  const windSpeed = data.hourly.windspeed_10m[hour];
  const humidity = data.hourly.relative_humidity_2m[hour];

  console.log(
    `Temperature at ${hour}:00 ${data.hourly.temperature_2m[hour]} \n Temperature ${temperature} and Wind Speed ${windSpeed} \n humidity ${humidity}`
  );

  document.getElementById(CURRENT_TIME_ID).innerHTML = `Time: ${hour}`;
  document.getElementById(WIND_SPEED_ID).innerHTML = `Wind Speed: ${windSpeed}`;
  document.getElementById(HUMIDITY_ID).innerHTML = `Humidity: ${humidity}`;
  document.getElementById(
    TEMPERATURE_ID
  ).innerHTML = `Temperature: ${temperature}`;
};
