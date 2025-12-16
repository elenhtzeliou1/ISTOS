//video list page generator
(function () {
  function init() {
    const listContainer = document.getElementById("video-list");
    if (!listContainer) return;

    // Prevent double init
    if (listContainer.dataset.videosBound === "1") return;
    listContainer.dataset.videosBound = "1";

    // Sidebar open/close UI
    window.FilterUI?.init();

    if (typeof VIDEOS === "undefined") {
      console.error("VIDEOS missing. Did you load assets/js/data/videos.js?");
      return;
    }

    const resultsCount = document.getElementById("results-count");

    // Grab filters from videos.html
    const categoryCheckboxes = Array.from(
      document.querySelectorAll('input[name="filter-category"]')
    );
    const difficultyCheckboxes = Array.from(
      document.querySelectorAll('input[name="filter-difficulty"]')
    );
    const availabilityFilter = document.getElementById("filter-available");

    const norm = (v) =>
      String(v || "")
        .toLowerCase()
        .trim();

    function setCount(n) {
      if (!resultsCount) return;
      resultsCount.textContent = n === 1 ? "Video (1)" : `Videos (${n})`;
    }

    // ---------- Equal heights ----------
    let rafId = 0;
    function equalizeNewBoxHeights() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const cards = Array.from(listContainer.querySelectorAll(".new-box"));
        if (!cards.length) return;

        cards.forEach((c) => (c.style.height = "auto"));
        const maxH = Math.max(
          ...cards.map((c) => c.getBoundingClientRect().height)
        );
        cards.forEach((c) => (c.style.height = `${maxH}px`));
      });
    }

    function equalizeAfterImages() {
      equalizeNewBoxHeights();
      listContainer.querySelectorAll("img").forEach((img) => {
        if (!img.complete) {
          img.addEventListener("load", equalizeNewBoxHeights, { once: true });
          img.addEventListener("error", equalizeNewBoxHeights, { once: true });
        }
      });
    }

    window.addEventListener("resize", equalizeAfterImages);
    window.visualViewport?.addEventListener("resize", equalizeAfterImages);

    // ---------- Render ----------
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

        card.addEventListener("click", () => {
          window.location.href = `video-details.html?id=${encodeURIComponent(
            video.id
          )}`;
        });

        listContainer.appendChild(card);
      });

      equalizeAfterImages();
    }

    // ---------- Filtering ----------
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

    // Bind filter events
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    difficultyCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    availabilityFilter?.addEventListener("change", applyFilters);

    // Initial render
    renderVideos(VIDEOS);
  }

  window.VideosPage = { init };
})();
