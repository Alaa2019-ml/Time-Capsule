# ⏳ Time Capsule

> **Explore the past like never before.**

Time Capsule is an interactive web application that allows users to experience what the world felt like on a specific date in the past.

By selecting a date and entering a city, users can uncover historical weather, music, movies, and news — all combined into a visually rich and engaging experience.

---

## 🎥 Demo

https://github.com/user-attachments/assets/2e0647e3-0507-4585-b200-e87dcbc95df6


---

## ✨ Features

- 📅 Select any past date  
- 📍 Enter a city to personalize results  
- 🌦 View historical weather data  
- 🎵 Explore music releases with cover art  
- 🎬 Discover movies from the selected year  
- 📰 Read historical news and events  
- 🔄 Load more results dynamically  
- 🖼 Image-rich UI for better user experience  

---

## 🧠 Concept

> *What was happening in the world on a specific day in the past?*

Time Capsule answers this by combining multiple data sources into one seamless timeline experience.

---

## ⚙️ How It Works

1. User selects a date and enters a city  
2. City is converted into geographic coordinates  
3. Historical weather data is retrieved  
4. Music, movie, and news data are fetched  
5. Results are displayed in interactive sections  

---

## 🛠 Tech Stack

- HTML  
- CSS  
- JavaScript  
- Swiper.js  

---
## 🔗 External APIs

- 🌦 **Open-Meteo** — Geocoding + historical weather data  
- 🎵 **MusicBrainz** — Music releases by year  
- 🖼 **Cover Art Archive** — Album artwork  
- 🎬 **TMDB** — Movie data + popularity ranking  
- 📰 **New York Times API** — Historical news articles  
- 📚 **Wikipedia API** — Events and summaries by date  
---

## 🚀 Getting Started

Run locally:

```bash
# Open directly in browser
index.html
```

## 📁 Project Structure

```text
Time-Capsule/
├── index.html
├── public/
│   └── style.css
├── src/
│   ├── pages/
│   ├── views/
│   ├── utils/
│   ├── constants.js
│   └── data.js
└── README.md

