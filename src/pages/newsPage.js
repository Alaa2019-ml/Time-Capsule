import { NEWS_INTERFACE_ID } from "../constants.js";
import { createNewsElement } from "../views/newsView.js";
import {
  fetchJson,
  pickRandomItems,
  getMonthName,
} from "../utils/functions.js";

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

  showNewsInThePast(date);
};

const showNewsInThePast = (dateStr) => {
  if (!dateStr) {
    console.error("Please select a date first.");
    return;
  }
  const [y, m, d] = dateStr.trim().split("-");
  const month = getMonthName(Number(m));
  const day = Number(d);
  const year = Number(y);

  console.log("Parsed date:", day, month, year);
  // const yearr = 2020;

  const newsLinksUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=Portal:Current_events/${year} ${month} ${day}&prop=text&format=json&origin=*`;
  fetchJson(newsLinksUrl).then((data) => {
    // get the HTML part
    const newsLinksArr = getWikipediaLinksFromHtml(data);
    const randomNews = pickRandomItems(newsLinksArr);
    let url = ``;
    randomNews.forEach((ele) => {
      url = `https://en.wikipedia.org/api/rest_v1/page/summary/${ele}`;
      renderResults(url);
    });
  });
};

const getWikipediaLinksFromHtml = (data) => {
  const html = data.parse.text["*"];
  const doc = new DOMParser().parseFromString(html, "text/html");
  // find all links that go to wiki pages
  const links = doc.querySelectorAll("a[href^='/wiki/']");
  // console.log(links);
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
  const ul = document.createElement("ul");
  // const li = document.createElement("li");

  const detailsLi = document.createElement("li");
  fetchJson(url)
    .then((data) => {
      const title = data.title;
      const summary = data.extract;
      const image = data.originalimage?.source;

      // li.innerHTML = `
      //   News Title: ${title} <br><br>
      //   News Summary: ${summary} <br><br>
      //   <img src=${image} alt="">
      //   `;

      detailsLi.innerHTML = `
  <div style="padding:10px 0;border-bottom:1px solid #eee;">
    <div><strong>News title:</strong> ${title ?? "N/A"}</div>
    <div><strong>Summary:</strong> ${summary ?? "N/A"}</div>

    <div>
    <img src="${image}" style="width:100%;max-height:250px;object-fit:cover;border-radius:6px;" alt="cover">
    </div>
  </div>
`;
      ul.appendChild(detailsLi);

      const container = document.getElementById(NEWS_INTERFACE_ID);
      if (container && !container.contains(ul)) {
        container.appendChild(ul);
      }
    })
    .catch((err) => console.log(err));

  // ul.appendChild(li);

  document.body.appendChild(ul);
};
