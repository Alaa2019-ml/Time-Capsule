// views/moviesView.js
export const createMoviesElement = () => {
  const el = document.createElement("section");
  el.className = "section";
  el.innerHTML = `
    <h3 style="margin:0 0 10px; font-weight:900">Movies</h3>
    <div id="movies-swiper" class="swiper">
      <div class="swiper-wrapper"></div>
      <div class="swiper-button-prev" aria-label="Previous"></div>
      <div class="swiper-button-next" aria-label="Next"></div>
    </div>
  `;
  return el;
};
