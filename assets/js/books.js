document.addEventListener("DOMContentLoaded", () => {
  // main grid
  const listContainer = document.getElementById("course-list");
  const resultsCount = document.getElementById("results-count");

  // filters
  const categoryCheckboxes = document.querySelectorAll(
    'input[name="filter-category"]'
  );
  const difficultyCheckboxes = document.querySelectorAll(
    'input[name="filter-difficulty"]'
  ); // will only work if books have .difficulty
  const availabilityFilter = document.getElementById("filter-available");

  // filter sidebar controls (same as courses page)
  const filterToggleBtn = document.getElementById("filter-toggle");
  const filterSidebar = document.querySelector(".filter-sidebar");
  const filterBackdrop = document.getElementById("filter-backdrop");
  const filterCloseBtn = document.getElementById("filter-close");
  const toggleFilterMenuBtn = document.getElementById("toggle-filter-menu");

  // optional modal 
  const modal = document.getElementById("book-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!listContainer) {
    console.error("#course-list not found on books page.");
    return;
  }

  if (typeof BOOKS === "undefined") {
    console.error("BOOKS data is missing. Check assets/js/data/books.js");
    return;
  }

  /* === FILTER SIDE PANEL TOGGLE (same as courses) === */

  if (toggleFilterMenuBtn && filterSidebar) {
    toggleFilterMenuBtn.addEventListener("click", () => {
      const isCollapsed = filterSidebar.classList.toggle("is-collapsed");
      toggleFilterMenuBtn.textContent = isCollapsed
        ? "Show Filters"
        : "Hide Filters";
    });
  }

  function openFilter() {
    if (!filterSidebar) return;
    filterSidebar.classList.add("is-open");
    if (filterBackdrop) filterBackdrop.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function closeFilter() {
    if (!filterSidebar) return;
    filterSidebar.classList.remove("is-open");
    if (filterBackdrop) filterBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  if (filterToggleBtn) {
    filterToggleBtn.addEventListener("click", openFilter);
  }

  if (filterBackdrop) {
    filterBackdrop.addEventListener("click", closeFilter);
  }

  if (filterCloseBtn) {
    filterCloseBtn.addEventListener("click", closeFilter);
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeFilter();
  });

  /* === INITIAL RENDER === */

  renderBooks(BOOKS);

  /* === FILTERS === */

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
    let filtered = [...BOOKS];

    // categories
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((book) =>
        selectedCategories.includes(book.category)
      );
    }

    // difficulty (only if your BOOKS have a .difficulty property)
    const selectedDifficulties = Array.from(difficultyCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((book) =>
        selectedDifficulties.includes(book.difficulty)
      );
    }

    // availability
    if (availabilityFilter && availabilityFilter.checked) {
      filtered = filtered.filter((book) => book.available);
    }

    renderBooks(filtered);
  }

  /* === RENDER CARDS === */

  function renderBooks(bookArray) {
    listContainer.innerHTML = "";

    if (resultsCount) {
      const count = bookArray.length;
      resultsCount.textContent =
        count === 1 ? "Book (1)" : `Books (${count})`;
    }

    if (!bookArray.length) {
      listContainer.innerHTML =
        '<p style="color:white;">No books found.</p>';
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
         <div class="course-thumb" style="
          background-image:url('${book.cover}');
          background-size:cover;
          background-position:center;
        "></div>
      `;

      if (modal && modalBody) {
        card.addEventListener("click", () => openModal(book));
      }

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

  /* === OPTIONAL MODAL === */

  function openModal(book) {
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-body">
        <h2>${book.title}</h2>
        <div class="modal-tags">
          <span class="tag">${prettyCategory(book.category)}</span>
          ${
            book.difficulty
              ? `<span class="tag">${book.difficulty}</span>`
              : ""
          }
          ${
            book.available
              ? "<span class='tag available'>Available</span>"
              : "<span class='tag unavailable'>Unavailable</span>"
          }
        </div>
        <p>${book.description}</p>
        <button class="modal-enroll-btn">Order Book</button>
      </div>
    `;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  if (modal && modalClose) {
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }
});
