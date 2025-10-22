// import { USER_INTERFACE_ID } from "../constants.js";
import { createPage } from "../utils/createPage.js";
import {
  CURRENT_TIME_ID,
  WIND_SPEED_ID,
  HUMIDITY_ID,
  TEMPERATURE_ID,
} from "../constants.js";

export const createWeatherElement = () => {
  return createPage(
    String.raw`
      
    <section class="section">
  <div class="section__bar">
    <div class="section__title">WEATHER</div>
    <a class="chip chip--accent" href="#">Change location</a>
  </div>

  <div class="weather">
    <div class="weather__icon" id="weather-icon">🌤️</div>
    <div>
      <div class="weather__city" id="weather-city">Amsterdam, NL</div>
      <div id="${CURRENT_TIME_ID}" class="weather__sub">Time: --</div>
      <div id="${TEMPERATURE_ID}" class="weather__now">Temperature: --</div>
      <div id="${WIND_SPEED_ID}" class="weather__sub">Wind Speed: --</div>
      <div id="${HUMIDITY_ID}" class="weather__sub">Humidity: --</div>
    </div>
  </div>
</section>
        `
  );
};
