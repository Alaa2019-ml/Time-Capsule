import { createPage } from "../utils/createPage.js";
import { NEWS_List_DIV_CLASS } from "../constants.js";

export const createNewsElement = () => {
  return createPage(
    String.raw`
       <div class=${NEWS_List_DIV_CLASS}>
       </div>
        `
  );
};
