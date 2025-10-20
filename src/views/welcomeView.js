import { createPage } from "../utils/createPage.js";
import { TIME_JUMP_BUTTON_ID } from "../constants.js";
import { SELECTED_DATE_ID } from "../constants.js";
import { SELECTED_CITY_ID } from "../constants.js";

export const createWelcomeElement = () => {
  return createPage(
    String.raw`
         <label for="">Date: </label>
         <input type="date" id=${SELECTED_DATE_ID} /> 
          <br />
    <br />
    <label for="city">City: </label>
    <input type="text" id=${SELECTED_CITY_ID} />
    <button id="${TIME_JUMP_BUTTON_ID}">Time Jump</button>
        `
  );
};
