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
       <div id=${CURRENT_TIME_ID}></div>
    <div id="${TEMPERATURE_ID}"></div>
    <div id=${WIND_SPEED_ID}></div>
    <div id=${HUMIDITY_ID}></div>
        `
  );
};
