(function () {
  function init() {
    if (typeof VIDEOS === "undefined") {
      console.error("Video data is missing! check videos.js path!");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const videoId = params.get("id");

    if (!videoId) {
      console.warn("No video id found in URL!");
      return;
    }

    const video = VIDEOS.find((v) => v.id == videoId);

    if (!video) {
      console.warn("Video not found for this specific id:", videoId);
      return;
    }

    const titleVd = document.getElementById("vd__title");
    const descVd = document.getElementById("vd__description");
    const catVd = document.getElementById("vd-category");
    const diffVd = document.getElementById("vd-diff");
    const coverVd = document.getElementById("vd-cover");

    if (titleVd) titleVd.textContent = video.title;
    if (descVd) descVd.textContent = video.description;
    if (catVd) catVd.textContent = video.category;
    if (diffVd) diffVd.textContent = video.difficulty;

    if (coverVd) {
      if (video.cover) {
        coverVd.src = video.cover;
        coverVd.alt = `${video.title} cover`;
      } else {
        coverVd.alt = `${video.title} cover not available`;
      }
    }
  }
  window.VideoDetailsPage = { init };
})();
