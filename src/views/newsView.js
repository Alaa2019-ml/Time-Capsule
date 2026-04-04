import { createPage } from "../utils/createPage.js";
import { NEWS_List_DIV_CLASS } from "../constants.js";

export const createNewsElement = () => {
  return createPage(
    String.raw`
       <div class=${NEWS_List_DIV_CLASS}>
       </div>
       <div class="section__actions">
         <button id="news-load-more" class="load-more-button" type="button">Load more news</button>
       </div>
        `
  );
};
