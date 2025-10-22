import { MOVIES_INTERFACE_ID } from "../constants.js";
import { createMoviesElement } from "../views/moviesView.js";
import { fetchJson, getTopFive } from "../utils/functions.js";
import { MOVIES_API_KEY } from "../utils/keys.js";

export const initMoviesPage = (date) => {
  let moviesInterface = document.getElementById(MOVIES_INTERFACE_ID);

  if (!moviesInterface) {
    const main = document.querySelector("main");
    moviesInterface = document.createElement("div");
    moviesInterface.id = MOVIES_INTERFACE_ID;
    main.appendChild(moviesInterface);
  }

  moviesInterface.innerHTML = "";
  const moviesElement = createMoviesElement();
  moviesInterface.appendChild(moviesElement);

  showMoviesInThePast(date);
};

const showMoviesInThePast = (dateStr) => {
  if (!dateStr) {
    console.error("Please select a date first.");
    return;
  }

  const [y] = dateStr.trim().split("-");
  const year = Number(y);

  const moviesUrl =
    `https://api.themoviedb.org/3/discover/movie` +
    `?primary_release_year=${year}` +
    `&sort_by=vote_average.desc` +
    `&vote_count.gte=1000` +
    `&include_adult=true` +
    `&api_key=${MOVIES_API_KEY}`;

  fetchJson(moviesUrl)
    .then((data) => {
      const movies = getAllMovies(data);

      //  getTopFive expects a key string, use "popularity"
      const popularMovies = Array.isArray(movies)
        ? getTopFive(movies, "popularity")
        : [];

      renderResults(popularMovies);
    })
    .catch((err) => console.log(err));
};

const renderResults = (arr) => {
  const container = document.getElementById(MOVIES_INTERFACE_ID);
  if (!container) return;

  const wrapper = container.querySelector("#movies-swiper .swiper-wrapper");
  if (!wrapper) return;

  // clear existing slides
  wrapper.innerHTML = "";

  arr.forEach((movie) => {
    const slide = document.createElement("article");
    slide.className = "swiper-slide card";

    const safeTitle = (movie.movieTitle ?? "N/A").replace(/"/g, "&quot;");
    const poster =
      movie.posterPath || "https://placehold.co/500x750?text=No+Image";
    const year =
      movie.releaseYear ??
      (movie.releaseDate ? movie.releaseDate.slice(0, 4) : "N/A");

    slide.innerHTML = `
  <img class="card__img" src="${poster}" alt="${safeTitle}" />
  <div class="pill">${safeTitle}</div>
  <div class="meta">
    <span>${year}</span>
  </div>
  <div class="card__overview">${
    movie.movieOverview
      ? movie.movieOverview.slice(0, 120) + "..."
      : "No overview available."
  }</div>
`;

    wrapper.appendChild(slide);
  });

  new Swiper("#movies-swiper", {
    slidesPerView: "auto",
    spaceBetween: 16,
    freeMode: { enabled: true },
    mousewheel: { forceToAxis: true },
    keyboard: true,
    navigation: {
      prevEl: "#movies-swiper .swiper-button-prev",
      nextEl: "#movies-swiper .swiper-button-next",
    },
  });
};

const getAllMovies = (data) => {
  const movies = [];
  (data?.results ?? []).forEach((movie) => {
    const category = movie.adult ? "adults" : "children";
    const language = movie.original_language;
    const movieTitle = movie.original_title;
    const movieOverview = movie.overview;
    const popularity = movie.popularity;
    const releaseDate = movie.release_date;
    const releaseYear = releaseDate ? releaseDate.slice(0, 4) : "N/A";
    const posterPath = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : "";

    movies.push({
      category,
      language,
      movieTitle,
      movieOverview,
      popularity,
      releaseDate,
      releaseYear,
      posterPath,
    });
  });
  return movies;
};
