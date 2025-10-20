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
  if (!dateStr) {
    console.error("Please select a date first.");
    return;
  }
  const [y, m, d] = dateStr.trim().split("-");
  const year = Number(y);

  const musicDetailsUrl = `https://musicbrainz.org/ws/2/release?query=date:${year} AND country:US&fmt=json`;
  fetchJson(musicDetailsUrl)
    .then((data) => {
      //1
      const songsDetails = saveAllSongsDetails(data);
      //end 1
      // we need first to save some elements randomly to a set
      const allReleasesIds = songsDetails
        .map((song) => song.relaseID)
        .filter(Boolean);

      console.log("All Releases Ids: ", allReleasesIds);
      const randomSongs = pickRandomItems(allReleasesIds, 6);

      const ul = document.createElement("ul");

      randomSongs.forEach((song, index) => {
        // Add small delays to avoid throttling
        setTimeout(() => {
          const songUrl = `https://musicbrainz.org/ws/2/release/${song}?inc=recordings+artist-credits+url-rels&fmt=json`;
          getEachSongDetails(songUrl, ul);

          const coverPageUrl = `https://coverartarchive.org/release/${song}`;
          getCoverPage(coverPageUrl, ul);
        }, index * 400); // 400ms gap between requests
      });
    })
    .catch((err) => console.log(err));
};

const saveAllSongsDetails = (data) => {
  const musicDict = [];
  const releases = data?.releases ?? [];
  for (const release of releases) {
    const title = release?.title ?? null;
    console.log(release.title); // ✅ album title
    const dateReleased = release?.date ?? null; // date relaesed
    const relaseID = release?.id ?? null; // release id
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
  console.log(musicDict);
  return musicDict;
};

const getEachSongDetails = (url, ul) => {
  fetchJson(url)
    .then((data) => {
      //   console.log("Relase Data: ", data);

      // individual or a group
      const purchaseLink = data?.relations?.[0]?.url?.resource ?? null;

      const typeBand =
        data?.media?.[0]?.tracks?.[0]?.["artist-credit"]?.[0]?.artist?.type ??
        null;
      const artistName =
        data?.media?.[0]?.tracks?.[0]?.["artist-credit"]?.[0]?.artist?.name ??
        null;
      const songTitle = data?.title ?? null;

      const detailsLi = document.createElement("li");
      detailsLi.innerHTML = `
  <div style="padding:10px 0;border-bottom:1px solid #eee;">
    <div><strong>Song:</strong> ${songTitle ?? "N/A"}</div>
    <div><strong>Artist:</strong> ${artistName ?? "N/A"}</div>
    <div><strong>Type:</strong> ${typeBand ?? "N/A"}</div>
    <div>
      <strong>Purchase Link:</strong>
      ${
        purchaseLink
          ? `<a href="${purchaseLink}" target="_blank" rel="noopener noreferrer">Click here</a>`
          : "N/A"
      }
    </div>
  </div>
`;
      ul.appendChild(detailsLi);

      const container = document.getElementById(MUSIC_INTERFACE_ID);
      if (container && !container.contains(ul)) {
        container.appendChild(ul);
      }
    })
    .catch((err) => console.log(err));
};

const loopOverAnArray = (arr) => {
  if (!Array.isArray(arr)) {
    return [];
  }
  if (arr.length === 0) return [];
  const ids = [];
  for (const elem of arr) {
    const id = elem?.artist?.id;
    if (id) ids.push(id); // store only truthy values
  }
  return ids;
};

const getCoverPage = (url, ul) => {
  fetchJson(url)
    .then((data) => {
      // console.log(data);
      const imageUrl = data?.images?.[0]?.image ?? null;
      console.log("Image Url", imageUrl);

      const li = document.createElement("li");
      if (imageUrl) {
        const li = document.createElement("li");
        li.innerHTML = `<img src="${imageUrl}" style="width:100%;max-height:250px;object-fit:cover;border-radius:6px;" alt="cover">`;
        ul.appendChild(li);
      }
    })
    .catch((err) => console.log(err));
};
