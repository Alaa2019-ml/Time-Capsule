import { MOVIES_INTERFACE_ID } from "../constants.js";
import { createMoviesElement } from "../views/moviesView.js";
import { fetchJson, renderError } from "../utils/functions.js";
import { MOVIES_API_KEY } from "../utils/keys.js";

const MOVIES_BATCH_SIZE = 6;
let moviesSwiperInstance = null;
let movieResults = [];
let renderedMoviesCount = 0;

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
    renderError("Please select a date first.");
    console.error("Please select a date first.");
    return;
  }

  const [y] = dateStr.trim().split("-");
  const year = Number(y);

  Promise.all([1, 2, 3].map((page) => fetchJson(buildMoviesUrl(year, page))))
    .then((pages) => {
      const movies = pages.flatMap(getAllMovies);
      const sortedMovies = sortMovies(movies);

      if (!Array.isArray(sortedMovies) || sortedMovies.length === 0) {
        console.warn("No movies found for that year.");
        return;
      }

      movieResults = sortedMovies;
      renderedMoviesCount = 0;
      const wrapper = document.querySelector("#movies-swiper .swiper-wrapper");
      if (wrapper) wrapper.innerHTML = "";

      if (moviesSwiperInstance) {
        moviesSwiperInstance.destroy(true, true);
        moviesSwiperInstance = null;
      }

      renderMoreMovies();
    })
    .catch((err) => {
      console.warn("Something went wrong while fetching movies.", err);
    });
};

const buildMoviesUrl = (year, page) =>
  `https://api.themoviedb.org/3/discover/movie` +
  `?primary_release_year=${year}` +
  `&sort_by=popularity.desc` +
  `&vote_count.gte=200` +
  `&include_adult=true` +
  `&page=${page}` +
  `&api_key=${MOVIES_API_KEY}`;

const renderMoreMovies = () => {
  const container = document.getElementById(MOVIES_INTERFACE_ID);
  if (!container) {
    renderError("Movies container not found.");
    return;
  }

  const wrapper = container.querySelector("#movies-swiper .swiper-wrapper");
  if (!wrapper) {
    renderError("Movies list area not found.");
    return;
  }

  const nextMovies = movieResults.slice(
    renderedMoviesCount,
    renderedMoviesCount + MOVIES_BATCH_SIZE
  );

  nextMovies.forEach((movie) => {
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

  renderedMoviesCount += nextMovies.length;

  if (!moviesSwiperInstance) {
    moviesSwiperInstance = new Swiper("#movies-swiper", {
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

    const nextBtn = container.querySelector("#movies-swiper .swiper-button-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (renderedMoviesCount < movieResults.length) {
          renderMoreMovies();
        }
      });
    }
  } else {
    moviesSwiperInstance.update();
  }
};

const sortMovies = (movies) =>
  [...movies]
    .filter((movie) => movie.movieTitle)
    .sort((a, b) => {
      const imageDelta =
        Number(Boolean(b.posterPath)) - Number(Boolean(a.posterPath));
      if (imageDelta !== 0) return imageDelta;
      return (b.popularity ?? 0) - (a.popularity ?? 0);
    });

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
