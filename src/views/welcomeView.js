import { createPage } from "../utils/createPage.js";
import {
  TIME_JUMP_BUTTON_ID,
  SELECTED_DATE_ID,
  SELECTED_CITY_ID,
} from "../constants.js";

export const createWelcomeElement = () => {
  return createPage(
    String.raw`
      <div class="welcome">
        <h2>Welcome to Time Machine</h2>
        <p>Choose a date and city to explore weather, news, and entertainment.</p>
        <label for="${SELECTED_DATE_ID}">Date:</label>
        <input type="date" id="${SELECTED_DATE_ID}" />
        <br /><br />
        <label for="${SELECTED_CITY_ID}">City:</label>
        <input type="text" id="${SELECTED_CITY_ID}" placeholder="Enter city" />
        <br /><br />
        <button id="${TIME_JUMP_BUTTON_ID}" class="chip chip--accent">Time Jump</button>
      </div>
    `
  );
};
