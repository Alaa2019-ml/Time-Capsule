// pages/musicPage.js
import { MUSIC_INTERFACE_ID } from "../constants.js";
import { createMusicElement } from "../views/musicView.js";
import { fetchJson, pickRandomItems } from "../utils/functions.js";

export const initMusicPage = (date) => {
  let musicInterface = document.getElementById(MUSIC_INTERFACE_ID);

  if (!musicInterface) {
    const main = document.querySelector("main");
    musicInterface = document.createElement("div");
    musicInterface.id = MUSIC_INTERFACE_ID;
    main.appendChild(musicInterface);
  }

  musicInterface.innerHTML = "";
  const musicElement = createMusicElement();
  musicInterface.appendChild(musicElement);

  showMusicInThePast(date);
};

const showMusicInThePast = (dateStr) => {
  const statusEl = document.getElementById("music-status");
  const listEl = document.getElementById("music-list");

  if (!dateStr) {
    if (statusEl) statusEl.textContent = "Please select a date first.";
    console.error("Please select a date first.");
    return;
  }

  if (statusEl) statusEl.textContent = "Loading…";
  if (listEl) listEl.innerHTML = "";

  const [y] = dateStr.trim().split("-");
  const year = Number(y);
  const musicDetailsUrl = `https://musicbrainz.org/ws/2/release?query=date:${year}&fmt=json`;

  fetchJson(musicDetailsUrl)
    .then((data) => {
      const songsDetails = saveAllSongsDetails(data);
      const allReleasesIds = songsDetails
        .map((s) => s.relaseID)
        .filter(Boolean);

      if (allReleasesIds.length === 0) {
        if (statusEl) statusEl.textContent = "No releases found for that year.";
        return;
      }

      const randomSongs = pickRandomItems(allReleasesIds, 6);
      if (statusEl) statusEl.textContent = "";
      if (!listEl) return;

      randomSongs.forEach((songId) => {
        const songUrl = `https://musicbrainz.org/ws/2/release/${songId}?inc=recordings+artist-credits+url-rels&fmt=json`;
        const coverUrl = `https://coverartarchive.org/release/${songId}`;

        Promise.all([getEachSongDetails(songUrl), getCoverPage(coverUrl)])
          .then(([details, imageUrl]) => {
            appendCoverImage(imageUrl, listEl, details);
          })
          .catch(() => {
            appendCoverImage(null, listEl, null);
          });
      });
    })
    .catch((err) => {
      console.error(err);
      if (statusEl)
        statusEl.textContent = "Something went wrong. Please try again.";
    });
};

const saveAllSongsDetails = (data) => {
  const musicDict = [];
  const releases = data?.releases ?? [];
  for (const release of releases) {
    const title = release?.title ?? null;
    const dateReleased = release?.date ?? null;
    const relaseID = release?.id ?? null;
    const relaseGroupId = release?.["release-group"]?.id ?? null;
    const country = release?.country ?? null;

    const arr = release?.["artist-credit"];
    const artistIds = loopOverAnArray(arr);

    musicDict.push({
      relaseID,
      title,
      dateReleased,
      relaseGroupId,
      artistId: artistIds,
      country,
    });
  }
  return musicDict;
};

const getEachSongDetails = (url) => {
  return fetchJson(url)
    .then((data) => {
      const purchaseLink = Array.isArray(data?.relations)
        ? data.relations.find((r) => r?.url?.resource)?.url?.resource ?? null
        : null;

      const track = data?.media?.[0]?.tracks?.[0];
      const artistCredit = track?.["artist-credit"]?.[0]?.artist;

      const typeBand = artistCredit?.type ?? null;
      const artistName = artistCredit?.name ?? null;
      const songTitle = data?.title ?? null;

      return { songTitle, artistName, typeBand, purchaseLink };
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

const loopOverAnArray = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const ids = [];
  for (const elem of arr) {
    const id = elem?.artist?.id;
    if (id) ids.push(id);
  }
  return ids;
};

const getCoverPage = (url) => {
  return fetchJson(url)
    .then((data) => {
      const first =
        (Array.isArray(data?.images) && data.images.find((img) => img.front)) ||
        data?.images?.[0];

      if (!first) return null;

      const thumbs = first.thumbnails || {};
      const imageUrl = thumbs.large || first.image || null;

      return imageUrl;
    })
    .catch(() => null);
};

const appendCoverImage = (imageUrl, ul, details) => {
  const li = document.createElement("li");
  li.classList.add("cover-item");

  li.innerHTML = `
    <div class="cover-container">
      ${
        imageUrl
          ? `
        <div class="cover-image-wrapper">
          <img src="${imageUrl}" class="cover-image" alt="cover">
        </div>
      `
          : ""
      }

      <div class="cover-details">
        <p><strong>Song:</strong> ${details?.songTitle ?? "N/A"}</p>
        <p><strong>Artist:</strong> ${details?.artistName ?? "N/A"}</p>
        <p><strong>Type:</strong> ${details?.typeBand ?? "N/A"}</p>
        <p><strong>Purchase Link:</strong>
          ${
            details?.purchaseLink
              ? `<a href="${details.purchaseLink}" target="_blank" rel="noopener noreferrer">Click here</a>`
              : "N/A"
          }
        </p>
      </div>
    </div>
  `;

  ul.appendChild(li);
};
