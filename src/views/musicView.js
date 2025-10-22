// views/musicView.js
import { createPage } from "../utils/createPage.js";

export const createMusicElement = () => {
  return createPage(String.raw`
    <section class="music" aria-labelledby="music-heading">
     

      <div class="music__status" id="music-status" aria-live="polite"></div>

      <div class="music__content">
        <ul id="music-list" class="covers-grid" aria-label="Album covers"></ul>
      </div>
    </section>
  `);
};
