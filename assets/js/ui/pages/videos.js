(function () {
  function init() {
    //main grid
    const listContainer = document.getElementById("video-list");
    if (!listContainer) {
      console.error("#video-list not found on books page.");
      return;
    }

    if (window.FilterUI) {
      window.FilterUI.init();
    }
    const resultsCount = document.getElementById("results-count");

    // filters
    const categoryCheckboxes = document.querySelectorAll(
      'input[name="filter-category"]'
    );
    const difficultyCheckboxes = document.querySelectorAll(
      'input[name="filter-difficulty"]'
    ); // will only work if videos have .difficulty
    const availabilityFilter = document.getElementById("filter-available");

    if (typeof VIDEOS === "undefined") {
      console.error("VIDEO data is missing. Check assets/js/data/video.js");
      return;
    }

    //initial render
    renderVideos(VIDEOS);

    //filter listeners
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );

    difficultyCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );

    if (availabilityFilter) {
      availabilityFilter.addEventListener("change", applyFilters);
    }

    function applyFilters() {
      let filtered = [...VIDEOS];

      // categories
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((video) =>
          selectedCategories.includes(video.category)
        );
      }

      // difficulty (only if your BOOKS have a .difficulty property)
      const selectedDifficulties = Array.from(difficultyCheckboxes)
        .filter((cv) => cv.checked)
        .map((cv) => cv.value);

      if (selectedDifficulties.length > 0) {
        filtered = filtered.filter((video) =>
          selectedDifficulties.includes(video.difficulty)
        );
      }

      // availability
      if (availabilityFilter && availabilityFilter.checked) {
        filtered = filtered.filter((video) => video.available);
      }

      renderVideos(filtered);
    }

    //render Videos
    function renderVideos(videosArray) {
      listContainer.innerHTML = "";

      if (resultsCount) {
        const count = videosArray.length;
        resultsCount.textContent =
          count === 1 ? "Video (1)" : `Videos (${count})`;
      }

      if (!videosArray.length) {
        listContainer.innerHTML = '<p style="color:white;">No books found.</p>';
        return;
      }

      videosArray.forEach((video) => {
        const card = document.createElement("article");
        card.className = "new-box";

        card.innerHTML = `
    
        <div class="new-box-header">
          <div class="tag-row">
          ${
            video.available
              ? "<span class='tag available'>Available</span>"
              : "<span class='tag unavailable'>Unavailable</span>"
          }
            <span class="tag category">${prettyCategory(video.category)}</span>
            ${
              video.difficulty
                ? `<span class="tag category">${video.difficulty}</span>`
                : ""
            }
            
          </div>

          <h4>${video.title}</h4>
          <h3>${video.description.substring(0, 120)}...</h3>

           
        </div>

         <div class="new-box-content">
            <img src="${video.cover || ""}" alt="${
          video.title || "Video"
        } cover">
     
        </div>
      `;

        card.addEventListener("click", () => {
          window.location.href = `video-details.html?id=${encodeURIComponent(
            video.id
          )}`;
        });
        listContainer.appendChild(card);
      });
    }

    function prettyCategory(cat) {
      switch (cat) {
        case "programming":
          return "Programming";
        case "networks":
          return "Networks";
        case "security":
          return "Cybersecurity";
        case "databases":
          return "Databases";
        default:
          return cat;
      }
    }
  }
  window.VideosPage = {init};
})();
