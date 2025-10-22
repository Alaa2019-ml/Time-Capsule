import {
  TIME_JUMP_BUTTON_ID,
  USER_INTERFACE_ID,
  SELECTED_CITY_ID,
  SELECTED_DATE_ID,
} from "../constants.js";

import { createWelcomeElement } from "../views/welcomeView.js";

import { initWeatherPage } from "./weatherPage.js";
import { initNewsPage } from "./newsPage.js";
import { initMusicPage } from "./musicPage.js";
import { initMoviesPage } from "./moviesPage.js";

export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);
  const date = document.getElementById(SELECTED_DATE_ID);
  const city = document.getElementById(SELECTED_CITY_ID);

  // const userInterface = document.querySelector("main");

  userInterface.innerHTML = "";
  //   userInterface.classList.add('welcome-mode');
  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  const btn = welcomeElement.querySelector(`#${TIME_JUMP_BUTTON_ID}`);

  if (btn) {
    // btn.addEventListener("click", initWeatherPage);
    btn.addEventListener("click", () => {
      const dateInput = document.getElementById(SELECTED_DATE_ID);
      if (!dateInput || !dateInput.value) {
        console.error("Please select a date first.");
        return;
      }

      const dateValue = dateInput.value; // e.g. "2023-10-18"

      initWeatherPage();
      initNewsPage(dateValue);
      initMusicPage(dateValue);
      initMoviesPage(dateValue);
    });
  } else {
    console.warn(`Button #${TIME_JUMP_BUTTON_ID} not found`);
  }
};
