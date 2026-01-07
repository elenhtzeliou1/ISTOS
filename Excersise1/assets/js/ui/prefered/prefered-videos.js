// Featured / recommended videos
// Used on:
// - index.html (homepage preview section)
// - videos.html (highlighted videos section)
// Responsible for selecting featured videos and rendering preview cards

(function () {
  function init() {
    // Wrapper that holds the featured video cards
    const prefered_videos_wrapper = document.getElementById(
      "prefered-videos-wrapper"
    );
    if (!prefered_videos_wrapper) return;

    // Ensure VIDEOS dataset is available
    if (typeof VIDEOS === "undefined") {
      console.error(
        "VIDEOS data missing. Did you load assets/js/data/videos.js? Check again!"
      );
      return;
    }

    // Select featured videos only
    let prefered = VIDEOS.filter((v) => v.featured);

    // Limit to first 3 featured videos
    prefered = prefered.slice(0, 3);

    // Render featured video cards
    prefered_videos_wrapper.innerHTML = prefered
      .map(
        (video) => `
      <a href="video-details.html?id=${encodeURIComponent(
        video.id
      )}" class="new-box">
        <div class="new-box-header">
          <span>2 days ago</span>
          <h4>${video.title}</h4>
          <h3>${video.description}</h3>
          <p>${video.category}</p>
        </div>
        <div class="new-box-content">
          <img src="${video.cover}" alt="${video.title}" />
        </div>
      </a>
    `
      )
      .join("");
  }

  // Public API
  window.PreferedVideosPage = { init };
})();
