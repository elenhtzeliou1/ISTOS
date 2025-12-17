//ta proteinomena videos pou emfanizontai sto index.htm kai sto videos.html
(function () {
  function init() {
    const prefered_videos_wrapper = document.getElementById(
      "prefered-videos-wrapper"
    );
    if (!prefered_videos_wrapper) return;

    if (typeof VIDEOS === "undefined") {
      console.error(
        "VIDEOS data missing. Did you load assets/js/data/videos.js? Check again!"
      );
      return;
    }

    let prefered = VIDEOS.filter((v) => v.featured);

    // keep only first 3
    prefered = prefered.slice(0, 3);

    // render them
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

  window.PreferedVideosPage = { init };
})();
