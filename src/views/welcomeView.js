import { createPage } from "../utils/createPage.js";
import {
  TIME_JUMP_BUTTON_ID,
  SELECTED_DATE_ID,
  SELECTED_CITY_ID,
} from "../constants.js";

export const createWelcomeElement = () => {
  return createPage(
    String.raw`
      <section class="welcome-stage">
        <div class="welcome-orb welcome-orb--pink"></div>
        <div class="welcome-orb welcome-orb--blue"></div>

        <div class="welcome">
          <div class="welcome__spark">Time travel, but make it fun</div>
          <h2 class="welcome__title">Pick a day. Pick a city. Jump into the vibe.</h2>
          <p class="welcome__lead">
            Time Capsule brings back the weather, music, movies, and headlines from the moment
            you choose.
          </p>

          <div class="welcome__chips">
            <span>Pop hits</span>
            <span>Old headlines</span>
            <span>Past weather</span>
            <span>Movie picks</span>
          </div>

          <div class="welcome__form">
            <label class="welcome__label" for="${SELECTED_DATE_ID}">Choose a date</label>
            <input class="welcome__input" type="date" required id="${SELECTED_DATE_ID}" />

            <label class="welcome__label" for="${SELECTED_CITY_ID}">Choose a city</label>
            <input
              class="welcome__input"
              type="text"
              id="${SELECTED_CITY_ID}"
              placeholder="Paris, Dubai, Seoul..."
            />

            <button id="${TIME_JUMP_BUTTON_ID}" class="welcome__button">
              Start the Time Jump
            </button>
          </div>
        </div>
      </section>
    `
  );
};
