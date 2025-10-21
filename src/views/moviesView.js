// import { USER_INTERFACE_ID } from "../constants.js";
import { createPage } from "../utils/createPage.js";
// import { NEWS_TITLE_ID, NEWS_SUMMARY_ID, NEWS_IMAGE_ID } from "../constants.js";

export const createMoviesElement = () => {
  return createPage(
    String.raw`
       <div id="music-results" class="music-container">
        <h2>Movies in the Past 🎵</h2>
        <div id="songs-list"></div>
      </div>
        `
  );
};
