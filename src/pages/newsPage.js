import { NEWS_INTERFACE_ID } from "../constants.js";
import { createNewsElement } from "../views/newsView.js";
import { fetchJson, getMonthName } from "../utils/functions.js";
import { NEWS_API_KEY } from "../utils/keys.js";

const NEWS_BATCH_SIZE = 4;
let newsResults = [];
let renderedNewsCount = 0;

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
  const loadMoreBtn = newsInterface.querySelector("#news-load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", renderMoreNews);
  }

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
      const allNews = data.response.docs;
      const newsArr = [];
      allNews.forEach((ele) => {
        newsArr.push({
          title: ele?.headline?.main ?? "N/A",
          summary: ele?.abstract ?? "N/A",
          publicationDate: ele?.pub_date ?? "",
          articleUrl: ele?.web_url ?? "",
          imageUrl: checkImgaeUrl(ele),
          popularity: Array.isArray(ele?.multimedia) ? ele.multimedia.length : 0,
        });
      });
      newsResults = sortNews(newsArr);
      renderedNewsCount = 0;
      const div = document.querySelector(".news-list");
      if (div) div.innerHTML = "";
      renderMoreNews();
    })
    .catch((err) => console.warn("Failed to load historical news.", err));
}; //end func

const checkUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `https://www.nytimes.com/${url}`;
};

const checkImgaeUrl = (ele) => {
  const dict = ele?.multimedia;

  if (!dict) return null;

  if (Array.isArray(dict)) {
    const preferred =
      dict.find((item) => item?.subtype === "xlarge") ||
      dict.find((item) => item?.subtype === "thumbnail") ||
      dict[0];

    return checkUrl(preferred?.url);
  }

  return checkUrl(dict.default?.url) || checkUrl(dict.thumbnail?.url) || null;
};

const showNewsInThePast = (d, m, y) => {
  const month = getMonthName(Number(m));
  const day = Number(d);
  const year = Number(y);

  console.log("Parsed date:", day, month, year);

  const newsLinksUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events/${year} ${month} ${day}&prop=text&format=json&origin=*`;
  fetchJson(newsLinksUrl)
    .then((data) => {
      const newsLinksArr = getWikipediaLinksFromHtml(data);
      const selectedNews = [...new Set(newsLinksArr)].slice(0, 18);

      return Promise.all(
        selectedNews.map((item) => {
          const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${item}`;
          return fetchJson(url)
            .then((page) => mapWikipediaResult(page))
            .catch((err) => {
              console.warn("Failed to render news result.", err);
              return null;
            });
        })
      ).then((items) => {
        newsResults = sortNews(items.filter(Boolean));
        renderedNewsCount = 0;
        const div = document.querySelector(".news-list");
        if (div) div.innerHTML = "";
        renderMoreNews();
      });
    })
    .catch((err) => console.warn("Failed to load historical news.", err));
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
const renderMoreNews = () => {
  const div = document.querySelector(".news-list");
  const container = document.getElementById(NEWS_INTERFACE_ID);
  if (!div || !container) return;

  const nextNews = newsResults.slice(
    renderedNewsCount,
    renderedNewsCount + NEWS_BATCH_SIZE
  );

  nextNews.forEach((item) => {
    div.appendChild(createNewsArticle(item));
  });

  renderedNewsCount += nextNews.length;
  updateNewsLoadMoreButton(container);
};

const updateNewsLoadMoreButton = (container) => {
  const loadMoreBtn = container.querySelector("#news-load-more");
  if (!loadMoreBtn) return;
  loadMoreBtn.hidden = renderedNewsCount >= newsResults.length;
};

const createNewsArticle = (item) => {
  const article = document.createElement("article");
  article.className = "news news--large";

  const imageHTML = item.imageUrl ? `<img src="${item.imageUrl}" alt="">` : "";
  const summary = item.summary ?? item.publicationDate?.slice(0, 4) ?? "Unknown";
  const metaDate = item.publicationDate
    ? `<div class="news__date">${item.publicationDate}</div>`
    : "";
  const pageUrl = item.pageUrl || item.articleUrl;

  article.innerHTML = `
    ${imageHTML}
    <div class="news__body">
      <h4 class="news__title">${item.title}</h4>
      <p class="news__summary">${summary}</p>
      ${
        pageUrl
          ? `<div><a href="${pageUrl}" target="_blank" rel="noopener">Read more...</a></div>`
          : ""
      }
      ${metaDate}
    </div>
  `;

  if (!item.imageUrl) article.classList.add("no-image");
  return article;
};

const mapWikipediaResult = (data) => ({
  title: data?.title ?? "N/A",
  summary: data?.extract ?? "N/A",
  imageUrl: data?.originalimage?.source || "",
  pageUrl:
    data?.content_urls?.desktop?.page || data?.content_urls?.mobile?.page || "",
  popularity: data?.thumbnail?.width ?? 0,
});

const sortNews = (items) =>
  [...items].sort((a, b) => {
    const imageDelta = Number(Boolean(b.imageUrl)) - Number(Boolean(a.imageUrl));
    if (imageDelta !== 0) return imageDelta;
    return (b.popularity ?? 0) - (a.popularity ?? 0);
  });
