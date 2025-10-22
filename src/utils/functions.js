// import fetch from "node-fetch";
export function getHourIn24Format() {
  const date = new Date();
  const hour = date.getHours().toString().padStart(2, "0");
  return hour;
}

export const getMonthName = (month) => {
  const d = new Date();
  d.setMonth(month - 1);
  const monthName = d.toLocaleString("default", { month: "long" });
  return monthName;
};

export const fetchJson = (url) => {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  });
};

export const pickRandomItems = (arr, num = 5) => {
  if (!Array.isArray(arr)) return [];
  if (typeof num !== "number") num = 5;
  const ransomlySavedItesms = new Set();

  while (ransomlySavedItesms.size < num) {
    const randomItem = Math.floor(Math.random() * arr.length);
    ransomlySavedItesms.add(arr[randomItem]);
  }

  return ransomlySavedItesms;
};

export const getTopFive = (arr, key) => {
  return arr.sort((a, b) => b[key] - a[key]).slice(0, 5);
};

export const dayMonthYear = (date) => date.value.trim().split("-");

export const renderError = (message) => {
  const modal = document.getElementById("myModal");
  const titleEl = document.getElementById("modalTitle");
  const msgEl = document.getElementById("modalMessage");
  const closeBtn = document.getElementsByClassName("close")[0];

  if (!modal || !msgEl || !titleEl) return alert(message);

  titleEl.textContent = "⚠️ Error";
  msgEl.textContent = message;

  modal.style.display = "flex"; // or "block" if your modal uses block layout

  closeBtn.onclick = () => (modal.style.display = "none");

  window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
};
