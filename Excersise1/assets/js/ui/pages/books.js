// Books filter page logic (books.html)
// Wrapped in an IIFE to avoid polluting the global scope
(function () {
  function init() {
    // Initialize shared filter UI (sidebar / mobile filters) if available
    if (window.FilterUI) {
      window.FilterUI.init();
    }

    // Main results grid and results counter
    const listContainer = document.getElementById("books-list");
    const resultsCount = document.getElementById("results-count");

    // Guard: required container must exist
    if (!listContainer) {
      console.error("#books-list not found on books page.");
      return;
    }

    // Guard: ensure books data is loaded
    if (typeof BOOKS === "undefined") {
      console.error("BOOKS data is missing. Check assets/js/data/books.js");
      return;
    }

    // Filter controls
    const categoryCheckboxes = document.querySelectorAll(
      'input[name="filter-category"]'
    );
    const difficultyCheckboxes = document.querySelectorAll(
      'input[name="filter-difficulty"]'
    );
    const availabilityFilter = document.getElementById("filter-available");

    // Maps internal category keys to human-readable labels
    function prettyCategory(category) {
      switch (category) {
        case "programming":
          return "Programming";
        case "networks":
          return "Networks";
        case "security":
          return "Cybersecurity";
        case "databases":
          return "Databases";
        case "ai":
          return "Artificial Intelligence";
        default:
          return category;
      }
    }

    // Renders the list of books into the grid
    function renderBooks(bookArray) {
      listContainer.innerHTML = "";

      // Update results counter
      if (resultsCount) {
        const count = bookArray.length;
        resultsCount.textContent =
          count === 1 ? "Book (1)" : `Books (${count})`;
      }

      // Empty state
      if (!bookArray.length) {
        listContainer.innerHTML = '<p style="color:white;">No books found.</p>';
        return;
      }

      // Create and append a card for each book
      bookArray.forEach((book) => {
        const card = document.createElement("article");
        card.className = "course-product book";
        card.style.cursor = "pointer";

        card.innerHTML = `
          <div class="course-info books">
            <div class="tag-row">
              ${
                book.available
                  ? "<span class='tag available'>Available</span>"
                  : "<span class='tag unavailable'>Unavailable</span>"
              }
              <span class="tag category">${prettyCategory(book.category)}</span>
              ${
                book.difficulty
                  ? `<span class="tag category">${book.difficulty}</span>`
                  : ""
              }
            </div>
            <h3>${book.title}</h3>
            <p>${book.description.substring(0, 120)}...</p>
          </div>
          <div class="books-cat-image" style="
            background-image:url('${book.cover}');
            background-size:cover;
            background-position:center;
          "></div>
        `;

        // Navigate to book details page on click
        card.addEventListener("click", () => {
          window.location.href = `book-details.html?id=${encodeURIComponent(
            book.id
          )}`;
        });

        listContainer.appendChild(card);
      });
    }

    // Applies all active filters to the BOOKS dataset
    function applyFilters() {
      let filtered = [...BOOKS];

      // Category filtering
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedCategories.length) {
        filtered = filtered.filter((b) =>
          selectedCategories.includes(b.category)
        );
      }

      // Difficulty filtering
      const selectedDifficulties = Array.from(difficultyCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedDifficulties.length) {
        filtered = filtered.filter((b) =>
          selectedDifficulties.includes(b.difficulty)
        );
      }

      // Availability filtering
      if (availabilityFilter && availabilityFilter.checked) {
        filtered = filtered.filter((b) => b.available);
      }

      renderBooks(filtered);
    }

    // Initial render based on current checkbox state (handles first load)
    requestAnimationFrame(applyFilters);

    // Re-apply filters when returning via browser back/forward cache
    window.addEventListener("pageshow", () => {
      requestAnimationFrame(applyFilters);
    });

    // Bind filter change listeners
    categoryCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    difficultyCheckboxes.forEach((cb) =>
      cb.addEventListener("change", applyFilters)
    );
    availabilityFilter?.addEventListener("change", applyFilters);
  }

  // Expose page initializer
  window.BooksPage = { init };
})();
