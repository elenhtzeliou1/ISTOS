//video-details.html page
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
    const coverVd = document.getElementById("vd-cover"); // <-- iframe

    if (titleVd) titleVd.textContent = video.title;
    if (descVd) descVd.textContent = video.description;
    if (catVd) catVd.textContent = video.category;
    if (diffVd) diffVd.textContent = video.difficulty;

    function getYouTubeId(url) {
      if (!url) return null;
      const m =
        url.match(/youtu\.be\/([^?&]+)/) ||
        url.match(/[?&]v=([^?&]+)/) ||
        url.match(/youtube\.com\/embed\/([^?&]+)/);
      return m ? m[1] : null;
    }

    if (coverVd) {
      const ytId = getYouTubeId(video.youtubeUrl);
      if (ytId) {
        coverVd.src = `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=0`;
      } else {
        coverVd.replaceWith(
          document.createTextNode("Video link not available.")
        );
      }
    }
  }

  window.VideoDetailsPage = { init };
})();
