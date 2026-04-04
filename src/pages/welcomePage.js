import {
  TIME_JUMP_BUTTON_ID,
  USER_INTERFACE_ID,
  SELECTED_CITY_ID,
  CHANGE_LOCATION_ID,
  SELECTED_DATE_ID,
  RESULTS_SEC_ID,
  MODAL_MESSAGE_ID,
  MODAL_TITLE_ID,
} from "../constants.js";
import { eras } from "../data.js";
import { createWelcomeElement } from "../views/welcomeView.js";

import { initWeatherPage } from "./weatherPage.js";
import { initNewsPage } from "./newsPage.js";
import { initMusicPage } from "./musicPage.js";
import { initMoviesPage } from "./moviesPage.js";
import { dayMonthYear, renderError } from "../utils/functions.js";
export const initWelcomePage = () => {
  const userInterface = document.getElementById(USER_INTERFACE_ID);

  userInterface.innerHTML = "";
  const welcomeElement = createWelcomeElement();
  userInterface.appendChild(welcomeElement);

  const btn = welcomeElement.querySelector(`#${TIME_JUMP_BUTTON_ID}`);
  const modal = document.getElementById("myModal");
  const span = document.getElementsByClassName("close")[0];

  const howItWorks = document.getElementById("howItWorks");

  howItWorks.addEventListener("click", () => {
    showHowItWorksModal(modal);
  });
  if (btn) {
    btn.addEventListener("click", () => {
      const dateInput = document.getElementById(SELECTED_DATE_ID);
      const selectedCity = document.getElementById(SELECTED_CITY_ID);

      if (!dateInput || !dateInput.value) {
        renderError("Please select a date first.");
        // console.error("Please select a date first.");

        return;
      }

      if (!selectedCity || !selectedCity.value.trim()) {
        // console.error("Please select  city first.");
        renderError("Please select city first.");
        return;
      }

      const dateValue = dateInput.value; // e.g. "2023-10-18"

      const resultsSec = document.getElementById(RESULTS_SEC_ID);
      if (resultsSec) resultsSec.style.display = "block";
      showIntroductoryMessage(dateInput, eras, modal);

      initWeatherPage();

      const changeLocationBtn = document.getElementById(CHANGE_LOCATION_ID);
      if (changeLocationBtn) {
        changeLocationBtn.addEventListener("click", () => {
          resultsSec.style.display = "none";
          initWelcomePage();
        });
      }

      initNewsPage(dateValue);
      initMusicPage(dateValue);
      initMoviesPage(dateValue);
    });
  } else {
    console.warn(`Button #${TIME_JUMP_BUTTON_ID} not found`);
  }

  span.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
};

const showIntroductoryMessage = (date, data, modal) => {
  const year = dayMonthYear(date)[0];
  if (year >= 1960 && year < 1970) {
    showModal(data[0]);
  } else if (year >= 1970 && year < 1980) {
    showModal(data[1]);
  } else if (year >= 1980 && year < 1990) {
    showModal(data[2]);
  } else if (year >= 1990 && year < 2000) {
    showModal(data[3]);
  } else if (year >= 2000 && year < 2010) {
    showModal(data[4]);
  } else if (year >= 2010 && year < 2020) {
    showModal(data[5]);
  } else {
    showModal(data[6]);
  }
  modal.style.display = "flex";
};

const showModal = (obj) => {
  document.getElementById(MODAL_TITLE_ID).innerHTML = "";
  document.getElementById(MODAL_MESSAGE_ID).innerHTML = "";
  document.getElementById(MODAL_TITLE_ID).innerHTML = obj.title;
  document.getElementById(MODAL_MESSAGE_ID).innerHTML = obj.message;
};

const showHowItWorksModal = (modal) => {
  document.getElementById(MODAL_TITLE_ID).innerHTML = "";
  document.getElementById(MODAL_MESSAGE_ID).innerHTML = "";

  document.getElementById(
    MODAL_TITLE_ID
  ).innerHTML = `<img src="./public/logo.png" alt="Time Capsule logo" class="modal-title__logo" />`;

  document.getElementById(
    MODAL_MESSAGE_ID
  ).innerHTML = `
    <div class="how-modal">
      <p class="how-modal__eyebrow">A playful trip into the past</p>
      <h2 class="how-modal__heading">See what the world felt like on any day you choose.</h2>
      <p class="how-modal__intro">
        Welcome to Time Capsule! Choose any date and city, and watch the past come alive.
        Discover the weather, music hits, popular movies, and biggest news from that time.
      </p>

      <div class="how-modal__grid">
        <div class="how-modal__card">
          <span class="how-modal__icon">📅</span>
          <strong>Pick a date</strong>
          <p>Go for your birthday, a favorite year, or any random day that makes you curious.</p>
        </div>
        <div class="how-modal__card">
          <span class="how-modal__icon">🌍</span>
          <strong>Choose a city</strong>
          <p>Set the place so the weather snapshot feels tied to a real location.</p>
        </div>
        <div class="how-modal__card">
          <span class="how-modal__icon">🎵</span>
          <strong>Open the vibe</strong>
          <p>Discover the songs, films, news, and mood of that moment in one screen.</p>
        </div>
      </div>

      <p class="how-modal__footer">Ready to travel through time? Good luck, explorer!</p>
    </div>`;

  modal.style.display = "flex";
};
