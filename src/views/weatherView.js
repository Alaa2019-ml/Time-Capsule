import { createPage } from "../utils/createPage.js";
import {
  CURRENT_TIME_ID,
  WIND_SPEED_ID,
  HUMIDITY_ID,
  TEMPERATURE_ID,
  WEATHER_ICON_ID,
  CHANGE_LOCATION_ID,
} from "../constants.js";

export const createWeatherElement = () => {
  return createPage(
    String.raw`
      
    <section class="section">
  <div class="section__bar">
    <div class="section__title">WEATHER</div>
    
     <a class="chip chip--accent"  id=${CHANGE_LOCATION_ID} href="#">Change location</a>
    
    
  </div>

  <div class="weather">
    <div class="weather__icon" id=${WEATHER_ICON_ID}>🌤️</div>
    <div>

      <div id="${CURRENT_TIME_ID}" class="weather__sub">Time: --</div>
      <div id="${TEMPERATURE_ID}" class="weather__now"> --</div>
      <div id="${WIND_SPEED_ID}" class="weather__sub">Wind Speed: --</div>
      <div id="${HUMIDITY_ID}" class="weather__sub">Humidity: --</div>
    </div>
  </div>
</section>
        `
  );
};
