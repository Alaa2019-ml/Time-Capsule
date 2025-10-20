// import { USER_INTERFACE_ID } from "../constants.js";
import { createPage } from "../utils/createPage.js";
// import { NEWS_TITLE_ID, NEWS_SUMMARY_ID, NEWS_IMAGE_ID } from "../constants.js";

export const createMusicElement = () => {
  return createPage(
    String.raw`
       <div id="music-results" class="music-container">
        <h2>Music From the Past 🎵</h2>
        <div id="songs-list"></div>
      </div>
        `
  );
};
