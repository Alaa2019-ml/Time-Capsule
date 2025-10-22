import { initWelcomePage } from "./pages/welcomePage.js";

const loadApp = () => {
  initWelcomePage();
};

// Run app on page load
window.addEventListener("load", loadApp);
