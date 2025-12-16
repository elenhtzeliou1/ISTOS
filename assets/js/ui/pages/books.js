//books-filter-page (books.html)
(function () {
  function init() {
    if (window.FilterUI) {
      window.FilterUI.init();
    }

    // main grid
    const listContainer = document.getElementById("books-list");
    const resultsCount = document.getElementById("results-count");

    if (!listContainer) {
      console.error("#books-list not found on books page.");
      return;
    }

    if (typeof BOOKS === "undefined") {
      console.error("BOOKS data is missing. Check assets/js/data/books.js");
      return;
    }
    // filters
    const categoryCheckboxes = document.querySelectorAll(
      'input[name="filter-category"]'
    );
    const difficultyCheckboxes = document.querySelectorAll(
      'input[name="filter-difficulty"]'
    );
    const availabilityFilter = document.getElementById("filter-available");

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

    function renderBooks(bookArray) {
      listContainer.innerHTML = "";

      if (resultsCount) {
        const count = bookArray.length;
        resultsCount.textContent =
          count === 1 ? "Book (1)" : `Books (${count})`;
      }

      if (!bookArray.length) {
        listContainer.innerHTML = '<p style="color:white;">No books found.</p>';
        return;
      }

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

        card.addEventListener("click", () => {
          window.location.href = `book-details.html?id=${encodeURIComponent(
            book.id
          )}`;
        });

        listContainer.appendChild(card);
      });
    }

    function applyFilters() {
      let filtered = [...BOOKS];

      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedCategories.length) {
        filtered = filtered.filter((b) =>
          selectedCategories.includes(b.category)
        );
      }

      const selectedDifficulties = Array.from(difficultyCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedDifficulties.length) {
        filtered = filtered.filter((b) =>
          selectedDifficulties.includes(b.difficulty)
        );
      }

      if (availabilityFilter && availabilityFilter.checked) {
        filtered = filtered.filter((b) => b.available);
      }

      renderBooks(filtered);
    }

   // Render based on current checkbox state (works on first load too)
    requestAnimationFrame(applyFilters);

    // Re-apply filters when coming back via browser back/forward cache
    window.addEventListener("pageshow", () => {
      requestAnimationFrame(applyFilters);
    });

    categoryCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    difficultyCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    availabilityFilter?.addEventListener("change", applyFilters);
  }

  window.BooksPage = {init};
})();
