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

  const [y] = dateStr.trim().split("-");
  const year = Number(y);
  const musicDetailsUrl = `https://musicbrainz.org/ws/2/release?query=date:${year} AND country:US&fmt=json`;

  fetchJson(musicDetailsUrl)
    .then((data) => {
      const songsDetails = saveAllSongsDetails(data);
      const allReleasesIds = songsDetails
        .map((song) => song.relaseID)
        .filter(Boolean);

      const coverChecks = allReleasesIds.map((id) => {
        const url = `https://coverartarchive.org/release/${id}`;
        return fetch(url)
          .then((res) => (res.ok ? id : null))
          .catch(() => null);
      });

      Promise.all(coverChecks)
        .then((results) => {
          const releasesWithCovers = results.filter(Boolean);
          const randomSongs = pickRandomItems(releasesWithCovers, 6);

          const ul = document.createElement("ul");
          const container = document.getElementById(MUSIC_INTERFACE_ID);
          if (container && !container.contains(ul)) container.appendChild(ul);

          // chain the fetches so that details + cover are rendered together
          randomSongs.forEach((songId, index) => {
            setTimeout(() => {
              const songUrl = `https://musicbrainz.org/ws/2/release/${songId}?inc=recordings+artist-credits+url-rels&fmt=json`;
              const coverUrl = `https://coverartarchive.org/release/${songId}`;

              //fetch both and render when both are ready
              Promise.all([getEachSongDetails(songUrl), getCoverPage(coverUrl)])
                .then(([details, imageUrl]) => {
                  appendCoverImage(imageUrl, ul, details);
                })
                .catch(() => {
                  appendCoverImage(null, ul, null);
                });
            }, index * 400);
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}; // end func

const saveAllSongsDetails = (data) => {
  const musicDict = [];
  const releases = data?.releases ?? [];
  for (const release of releases) {
    const title = release?.title ?? null;
    console.log(release.title); // album title
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

const getEachSongDetails = (url) => {
  return fetchJson(url)
    .then((data) => {
      const purchaseLink = data?.relations?.[0]?.url?.resource ?? null;
      const typeBand =
        data?.media?.[0]?.tracks?.[0]?.["artist-credit"]?.[0]?.artist?.type ??
        null;
      const artistName =
        data?.media?.[0]?.tracks?.[0]?.["artist-credit"]?.[0]?.artist?.name ??
        null;
      const songTitle = data?.title ?? null;

      return { songTitle, artistName, typeBand, purchaseLink };
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
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

const getCoverPage = (url) => {
  return fetchJson(url)
    .then((data) => {
      let imageUrl = data?.images?.[0]?.image ?? null;

      if (!imageUrl && Array.isArray(data?.images) && data.images.length > 0) {
        const first = data.images.find((img) => img.front) || data.images[0];
        const thumbs = first?.thumbnails || {};
        imageUrl =
          thumbs.large ||
          thumbs.small ||
          thumbs["500"] ||
          thumbs["250"] ||
          first?.image ||
          null;
      }

      if (!imageUrl) return null;
      return imageUrl;
    })
    .catch(() => null);
};

const appendCoverImage = (imageUrl, ul, details) => {
  const li = document.createElement("li");
  li.style.listStyle = "none";
  li.style.margin = "10px 0";
  li.innerHTML = `
    <div style="display:grid;grid-template-columns:160px 1fr;gap:12px;align-items:start;border:1px solid #eee;border-radius:10px;padding:12px;">
      <div>
        ${
          imageUrl
            ? `<img src="${imageUrl}" style="width:160px;max-height:160px;object-fit:cover;border-radius:8px;" alt="cover">`
            : `<div style="width:160px;height:160px;background:#f5f5f5;border:1px dashed #ccc;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#666;">No cover</div>`
        }
      </div>
      <div style="font-size:14px;line-height:1.5;">
        <div><strong>Song:</strong> ${details?.songTitle ?? "N/A"}</div>
        <div><strong>Artist:</strong> ${details?.artistName ?? "N/A"}</div>
        <div><strong>Type:</strong> ${details?.typeBand ?? "N/A"}</div>
        <div>
          <strong>Purchase Link:</strong>
          ${
            details?.purchaseLink
              ? `<a href="${details.purchaseLink}" target="_blank" rel="noopener noreferrer">Click here</a>`
              : "N/A"
          }
        </div>
      </div>
    </div>
  `;
  ul.appendChild(li);
};
