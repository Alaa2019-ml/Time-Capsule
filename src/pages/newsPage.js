import { NEWS_INTERFACE_ID } from "../constants.js";
import { createNewsElement } from "../views/newsView.js";
import {
  fetchJson,
  pickRandomItems,
  getMonthName,
} from "../utils/functions.js";
import { NEWS_API_KEY } from "../utils/keys.js";

export const initNewsPage = (date) => {
  let newsInterface = document.getElementById(NEWS_INTERFACE_ID);

  if (!newsInterface) {
    const main = document.querySelector("main");
    newsInterface = document.createElement("div");
    newsInterface.id = NEWS_INTERFACE_ID;
    main.appendChild(newsInterface);
  }

  newsInterface.innerHTML = "";
  const newsElement = createNewsElement();
  newsInterface.appendChild(newsElement);

  if (!date) {
    console.error("Please select a date first.");
    return;
  }
  const [y, m, d] = date.trim().split("-");

  if (Number(y) < 2005) {
    showsNewsBeforeTheYear2004(y);
  } else {
    showNewsInThePast(d, m, y);
  }
};

const showsNewsBeforeTheYear2004 = (y) => {
  const year = Number(y);
  const page = 4;
  const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${year}0101&end_date=${year}1231&page=${page}&api-key=${NEWS_API_KEY}`;

  fetchJson(url)
    .then((data) => {
      console.log(data);
      const allNews = data.response.docs;
      console.log(allNews);
      const newsArr = [];
      allNews.forEach((ele) => {
        const articleAbstract = ele.abstract;
        const documentType = ele.document_type;
        const articleHeadline = ele.headline.main;
        const publicationDate = ele.pub_date;
        const materialType = ele.type_of_material;
        const articleUrl = ele.web_url;
        const imageUrl = checkImgaeUrl(ele);

        const thumbnailImageUrl = ele.multimedia.thumbnail.url;

        newsArr.push({
          articleAbstract,
          documentType,
          articleHeadline,
          publicationDate,
          materialType,
          articleUrl,
          imageUrl,
          thumbnailImageUrl,
        });
      });
      // console.log(newsArr);
      const div = document.querySelector(".news-list");
      renderResultsBefore2004(newsArr, div);
    })
    .catch((err) => console.log(err));
}; //end func

const checkUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `https://www.nytimes.com/${url}`;
};

const checkImgaeUrl = (ele) => {
  const dict = ele?.multimedia;

  if (!dict) return;

  if (!Array.isArray(dict)) {
    return checkUrl(dict.default?.url) || checkUrl(dict.thumbnail?.url) || null;
  }
};

const showNewsInThePast = (d, m, y) => {
  const month = getMonthName(Number(m));
  const day = Number(d);
  const year = Number(y);

  console.log("Parsed date:", day, month, year);

  const newsLinksUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events/${year} ${month} ${day}&prop=text&format=json&origin=*`;
  fetchJson(newsLinksUrl)
    .then((data) => {
      // get the HTML part
      const newsLinksArr = getWikipediaLinksFromHtml(data);
      const randomNews = pickRandomItems(newsLinksArr);
      let url = ``;
      randomNews.forEach((ele) => {
        url = `https://en.wikipedia.org/api/rest_v1/page/summary/${ele}`;
        renderResults(url);
      });
    })
    .catch((err) => console.log(err));
};

const getWikipediaLinksFromHtml = (data) => {
  const html = data.parse.text["*"];
  const doc = new DOMParser().parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a[href^='/wiki/']");
  const arr = [];
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (
      href &&
      !href.match(
        /\/wiki\/(Special:|Talk:|File:|Template:|Help:|Portal:|Category:)/
      )
    ) {
      const item = href.split("/wiki/")[1].split("#")[0]; // clean title
      arr.push(item);
    }
  });

  return arr;
};
const renderResults = (url) => {
  fetchJson(url)
    .then((data) => {
      const title = data?.title ?? "N/A";
      const summary = data?.extract ?? "N/A";
      const image = data?.originalimage?.source || "";
      const pageUrl =
        data?.content_urls?.desktop?.page ||
        data?.content_urls?.mobile?.page ||
        "";

      const article = document.createElement("article");
      article.className = "news news--large";

      article.innerHTML = `
        ${image ? `<img src="${image}" alt="">` : ""}
        <div class="news__body">
          <h4 class="news__title">${title}</h4>
          <p class="news__summary">${summary}</p>
          ${
            pageUrl
              ? `<div><a href="${pageUrl}" target="_blank" rel="noopener">Read more…</a></div>`
              : ""
          }
        </div>
      `;

      // for browsers that don’t support :has()
      if (!image) article.classList.add("no-image");

      const container = document.getElementById(NEWS_INTERFACE_ID);
      if (container) container.appendChild(article);
    })
    .catch((err) => console.log(err));
};
const renderResultsBefore2004 = (arr, div) => {
  arr.forEach((ele) => {
    const publishedIn = ele.publicationDate?.slice(0, 4) ?? "Unknown";
    const article = document.createElement("article");
    article.className = "news news--large"; // for the larger layout

    // build image markup only if available
    const imageHTML = ele.imageUrl
      ? `<img src="${ele.imageUrl}" alt="News image">`
      : "";

    article.innerHTML = `
      ${imageHTML}
      <div class="news__body">
        <h4 class="news__title">${ele.articleHeadline}</h4>
        <p class="news__summary">${publishedIn}</p>
        <div><a href="${ele.articleUrl}" target="_blank" rel="noopener">Read more...</a></div>
        <div class="news__date">${ele.publicationDate}</div>
      </div>
    `;

    if (!ele.imageUrl) {
      article.classList.add("no-image");
    }

    div.appendChild(article);
  });
};
