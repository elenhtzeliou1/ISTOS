// video-details.html page logic
// Responsible for loading and displaying a single video's details based on URL parameter
(function () {
  function init() {
    // Guard: ensure video data is available
    if (typeof VIDEOS === "undefined") {
      console.error("Video data is missing! check videos.js path!");
      return;
    }

    // Read video id from query string (?id=...)
    const params = new URLSearchParams(window.location.search);
    const videoId = params.get("id");

    // Guard: id must exist
    if (!videoId) {
      console.warn("No video id found in URL!");
      return;
    }

    // Find the matching video (loose equality allows numeric/string ids)
    const video = VIDEOS.find((v) => v.id == videoId);

    // Guard: video must exist
    if (!video) {
      console.warn("Video not found for this specific id:", videoId);
      return;
    }

    // Cache DOM references
    const titleVd = document.getElementById("vd__title");
    const descVd = document.getElementById("vd__description");
    const catVd = document.getElementById("vd-category");
    const diffVd = document.getElementById("vd-diff");
    const coverVd = document.getElementById("vd-cover"); // iframe element

    // Populate basic text fields
    if (titleVd) titleVd.textContent = video.title;
    if (descVd) descVd.textContent = video.description;
    if (catVd) catVd.textContent = video.category;
    if (diffVd) diffVd.textContent = video.difficulty;

    // Extract YouTube video ID from common URL formats
    function getYouTubeId(url) {
      if (!url) return null;
      const m =
        url.match(/youtu\.be\/([^?&]+)/) ||
        url.match(/[?&]v=([^?&]+)/) ||
        url.match(/youtube\.com\/embed\/([^?&]+)/);
      return m ? m[1] : null;
    }

    // Inject YouTube embed iframe if possible
    if (coverVd) {
      const ytId = getYouTubeId(video.youtubeUrl);
      if (ytId) {
        coverVd.src = `https://www.youtube.com/embed/${ytId}?rel=0&autoplay=0`;
      } else {
        // Fallback if no valid YouTube URL exists
        coverVd.replaceWith(
          document.createTextNode("Video link not available.")
        );
      }
    }
  }

  // Expose page initializer
  window.VideoDetailsPage = { init };
})();
