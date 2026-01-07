// Video list page generator (videos.html)
// Responsible for:
// - Rendering video cards
// - Applying sidebar filters (category, difficulty, availability)
// - Keeping layout stable (equal card heights)
// - Handling browser back/forward cache restores

(function () {
  function init() {
    // Main container for video cards
    const listContainer = document.getElementById("video-list");
    if (!listContainer) return;

    // Prevent double initialization (important for SPA-like navigation / bfcache)
    if (listContainer.dataset.videosBound === "1") return;
    listContainer.dataset.videosBound = "1";

    // Initialize sidebar open/close + filter UI (shared utility)
    window.FilterUI?.init();

    // Ensure video data is loaded
    if (typeof VIDEOS === "undefined") {
      console.error("VIDEOS missing. Did you load assets/js/data/videos.js?");
      return;
    }

    const resultsCount = document.getElementById("results-count");

    // Filter inputs from sidebar
    const categoryCheckboxes = Array.from(
      document.querySelectorAll('input[name="filter-category"]')
    );
    const difficultyCheckboxes = Array.from(
      document.querySelectorAll('input[name="filter-difficulty"]')
    );
    const availabilityFilter = document.getElementById("filter-available");

    // Normalize string values for safe comparisons
    const norm = (v) =>
      String(v || "")
        .toLowerCase()
        .trim();

    // Update results counter
    function setCount(n) {
      if (!resultsCount) return;
      resultsCount.textContent = n === 1 ? "Video (1)" : `Videos (${n})`;
    }

    // -------------------------------------------------
    // Equal-height handling for video cards
    // Ensures consistent layout regardless of content
    // -------------------------------------------------
    let rafId = 0;

    function equalizeNewBoxHeights() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cards = Array.from(listContainer.querySelectorAll(".new-box"));
        if (!cards.length) return;

        // Reset heights to measure natural size
        cards.forEach((c) => (c.style.height = "auto"));

        const maxH = Math.max(
          ...cards.map((c) => c.getBoundingClientRect().height)
        );

        // Lock all cards to tallest height
        cards.forEach((c) => (c.style.height = `${maxH}px`));
      });
    }

    // Re-equalize after images load (images affect card height)
    function equalizeAfterImages() {
      equalizeNewBoxHeights();

      listContainer.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", equalizeNewBoxHeights, { once: true });
          img.addEventListener("error", equalizeNewBoxHeights, { once: true });
        }
      });
    }

    // Recalculate layout on viewport changes
    window.addEventListener("resize", equalizeAfterImages);
    window.visualViewport?.addEventListener("resize", equalizeAfterImages);

    // -------------------------------------------------
    // Rendering logic
    // -------------------------------------------------
    function renderVideos(videosArray) {
      listContainer.innerHTML = "";
      setCount(videosArray.length);

      if (!videosArray.length) {
        listContainer.innerHTML =
          '<p style="color:white;">No videos found.</p>';
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
              <span class="tag category">${video.category}</span>
              ${
                video.difficulty
                  ? `<span class="tag category">${video.difficulty}</span>`
                  : ""
              }
            </div>

            <h4>${video.title || ""}</h4>
            <h3>${(video.description || "").substring(0, 120)}...</h3>
          </div>

          <div class="new-box-content">
            <img src="${video.cover || ""}" alt="${
              video.title || "Video"
            } cover">
          </div>
        `;

        // Navigate to video details page
        card.addEventListener("click", () => {
          window.location.href = `video-details.html?id=${encodeURIComponent(
            video.id
          )}`;
        });

        listContainer.appendChild(card);
      });

      // Equalize heights after rendering
      equalizeAfterImages();
    }

    // -------------------------------------------------
    // Filtering logic
    // -------------------------------------------------
    function applyFilters() {
      let filtered = [...VIDEOS];

      const selectedCats = categoryCheckboxes
        .filter((cb) => cb.checked)
        .map((cb) => norm(cb.value));

      if (selectedCats.length) {
        filtered = filtered.filter((v) =>
          selectedCats.includes(norm(v.category))
        );
      }

      const selectedDiffs = difficultyCheckboxes
        .filter((cb) => cb.checked)
        .map((cb) => norm(cb.value));

      if (selectedDiffs.length) {
        filtered = filtered.filter((v) =>
          selectedDiffs.includes(norm(v.difficulty))
        );
      }

      if (availabilityFilter?.checked) {
        filtered = filtered.filter((v) => !!v.available);
      }

      renderVideos(filtered);
    }

    // Re-apply filters on UI interaction
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    difficultyCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    availabilityFilter?.addEventListener("change", applyFilters);

    // Initial render (respects default checkbox state)
    requestAnimationFrame(applyFilters);

    // Handle browser Back / Forward cache restores
    window.addEventListener("pageshow", () => {
      requestAnimationFrame(applyFilters);
    });
  }

  // Public API
  window.VideosPage = { init };
})();
