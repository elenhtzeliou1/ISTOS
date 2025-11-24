document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("book-list");
  const categoryFilter = document.getElementById("filter-category");
  const availabilityFilter = document.getElementById("filter-available");

  const modal = document.getElementById("book-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (typeof BOOKS === "undefined") {
    console.error("BOOKS data missing.");
    return;
  }

  renderBooks(BOOKS);

  categoryFilter.addEventListener("change", applyFilters);
  availabilityFilter.addEventListener("change", applyFilters);

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function applyFilters() {
    let filtered = BOOKS;

    if (categoryFilter.value !== "all") {
      filtered = filtered.filter(b => b.category === categoryFilter.value);
    }

    if (availabilityFilter.checked) {
      filtered = filtered.filter(b => b.available);
    }

    renderBooks(filtered);
  }

  function renderBooks(bookArray) {
    listContainer.innerHTML = "";

    if (bookArray.length === 0) {
      listContainer.innerHTML = `<p style="color:white;">No books found.</p>`;
      return;
    }

    bookArray.forEach(book => {
      const card = document.createElement("div");
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
            <span class="tag">${book.category}</span>
            ${
              book.available
                ? "<span class='tag available'>Available</span>"
                : "<span class='tag unavailable'>Unavailable</span>"
            }
          </div>
        </div>
      `;

      card.addEventListener("click", () => openModal(book));
      listContainer.appendChild(card);
    });
  }

  function openModal(book) {
  modalBody.innerHTML = `
    <div class="modal-body">
      <h2>${book.title}</h2>

      <div class="modal-tags">
        <span class="tag">${book.category}</span>
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
    modal.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }
});
