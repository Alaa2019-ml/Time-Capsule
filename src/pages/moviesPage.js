import { MOVIES_INTERFACE_ID } from "../constants.js";
import { createMoviesElement } from "../views/moviesView.js";
import {
  fetchJson,
  pickRandomItems,
  getMonthName,
  getTopFive,
} from "../utils/functions.js";
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

  const [y, m, d] = dateStr.trim().split("-");
  const year = Number(y);

  const moviesUrl = `https://api.themoviedb.org/3/discover/movie?primary_release_year=${year}&sort_by=vote_average.desc&vote_count.gte=1000&include_adult=true&api_key=${MOVIES_API_KEY}
`;
  fetchJson(moviesUrl)
    .then((data) => {
      console.log(data);
      //   const mostPopular = data.results[0];
      const movies = getAllMovies(data);
      //   const movies = [];
      //   data.results.forEach((movie) => {
      //     const category = movie.adult ? "adults" : "children";
      //     const language = movie.original_language;
      //     const movieTitle = movie.original_title;
      //     const movieOverview = movie.overview;
      //     const popularity = movie.popularity;
      //     const releaseDate = movie.release_date;
      //     const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
      //     movies.push({
      //       category,
      //       language,
      //       movieTitle,
      //       movieOverview,
      //       popularity,
      //       releaseDate,
      //       posterPath,
      //     }); // end of arr
      //   }); //end of loop
      // console.log(movies);
      const popularMovies = getTopFive(movies, movies.popularity);
      //   console.log(popularMovies);
      renderResults(popularMovies);
    })
    .catch((err) => console.log(err));
};

const renderResults = (arr) => {
  const ul = document.createElement("ul");
  arr.forEach((movie) => {
    const detailsLi = document.createElement("li");
    detailsLi.innerHTML = `
  <div style="padding:10px 0;border-bottom:1px solid #eee;">
    <div><strong>Movie Title:</strong> ${movie.movieTitle ?? "N/A"}</div>
    <div><strong>Overview:</strong> ${movie.movieOverview ?? "N/A"}</div>
     <div><strong>Release date:</strong> ${movie.releaseDate ?? "N/A"}</div>
     <div>
    <img src="${
      movie.posterPath
    }" style="width:100%;max-height:250px;object-fit:cover;border-radius:6px;" alt="cover">
    </div>
  </div>
`;
    ul.appendChild(detailsLi);
  });

  const container = document.getElementById(MOVIES_INTERFACE_ID);
  if (container && !container.contains(ul)) {
    container.appendChild(ul);
  }
};

const getAllMovies = (data) => {
  const movies = [];
  data.results.forEach((movie) => {
    const category = movie.adult ? "adults" : "children";
    const language = movie.original_language;
    const movieTitle = movie.original_title;
    const movieOverview = movie.overview;
    const popularity = movie.popularity;
    const releaseDate = movie.release_date;
    const posterPath = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    movies.push({
      category,
      language,
      movieTitle,
      movieOverview,
      popularity,
      releaseDate,
      posterPath,
    }); // end of arr
  }); //end of loop
  return movies;
};
