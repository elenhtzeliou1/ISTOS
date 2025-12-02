
document.addEventListener("DOMContentLoaded", () => {
  // ⬇️ matches your HTML: <div class="course-grid" id="course-list">
  const listContainer = document.getElementById("course-list");

  // ⬇️ checkboxes: name="filter-category"
  const categoryCheckboxes = document.querySelectorAll(
    'input[name="filter-category"]'
  );

  const availabilityFilter = document.getElementById("filter-available");
  const resultsCount = document.getElementById("results-count");

  // Optional modal support (if you add the modal HTML)
  const modal = document.getElementById("book-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!listContainer) {
    console.error("#course-list not found.");
    return;
  }

  renderBooks(BOOKS);

  // Listen on every category checkbox
  categoryCheckboxes.forEach(cb =>
    cb.addEventListener("change", applyFilters)
  );
  availabilityFilter.addEventListener("change", applyFilters);

  if (modal && modalClose) {
    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", e => {
      if (e.target === modal) closeModal();
    });
  }

  function applyFilters() {
    let filtered = [...BOOKS];

    // --- Category filter (multi-select via checkboxes) ---
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(book =>
        selectedCategories.includes(book.category)
      );
    }

    // --- Availability filter ---
    if (availabilityFilter.checked) {
      filtered = filtered.filter(book => book.available);
    }

    renderBooks(filtered);
  }

  function renderBooks(bookArray) {
    listContainer.innerHTML = "";

    if (bookArray.length === 0) {
      listContainer.innerHTML =
        '<p style="color:white;">No books found.</p>';
    } else {
      bookArray.forEach(book => {
        const card = document.createElement("article");
        card.className = "course-product";
        card.style.cursor = "pointer";

        card.innerHTML = `
          <div class="course-thumb" style="
            background-image:url('${book.cover}');
            background-size:cover;
            background-position:center;
          "></div>

          <div class="course-info">
            <h3>${book.title}</h3>
            <p>${book.description.substring(0, 120)}...</p>

            <div class="tag-row">
              <span class="tag category">${prettyCategory(book.category)}</span>
              ${
                book.available
                  ? "<span class='tag available'>Available</span>"
                  : "<span class='tag unavailable'>Unavailable</span>"
              }
            </div>
          </div>
        `;

        if (modal && modalBody) {
          card.addEventListener("click", () => openModal(book));
        }

        listContainer.appendChild(card);
      });
    }

    if (resultsCount) {
      resultsCount.textContent = `${bookArray.length} Αποτελέσματα`;
    }
  }

  function prettyCategory(cat) {
    switch (cat) {
      case "programming": return "Programming";
      case "networks":    return "Networks";
      case "security":    return "Cybersecurity";
      case "databases":   return "Databases";
      default:            return cat;
    }
  }

  function openModal(book) {
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-body">
        <h2>${book.title}</h2>
        <div class="modal-tags">
          <span class="tag">${prettyCategory(book.category)}</span>
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
});