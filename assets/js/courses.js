document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("course-list");
  const categoryFilter = document.getElementById("filter-category");
  const difficultyFilter = document.getElementById("filter-difficulty");
  const availabilityFilter = document.getElementById("filter-available");

  const modal = document.getElementById("course-modal");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");

  if (!listContainer) {
    console.error("course-list element not found.");
    return;
  }

  if (typeof COURSES === "undefined") {
    console.error("COURSES data is missing. Check courses.js path.");
    return;
  }

  renderCourses(COURSES);

  categoryFilter.addEventListener("change", applyFilters);
  difficultyFilter.addEventListener("change", applyFilters);
  availabilityFilter.addEventListener("change", applyFilters);

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  function applyFilters() {
    let filtered = COURSES;

    if (categoryFilter.value !== "all") {
      filtered = filtered.filter(c => c.category === categoryFilter.value);
    }

    if (difficultyFilter.value !== "all") {
      filtered = filtered.filter(c => c.difficulty === difficultyFilter.value);
    }

    if (availabilityFilter.checked) {
      filtered = filtered.filter(c => c.available);
    }

    renderCourses(filtered);
  }

  function renderCourses(courseArray) {
    listContainer.innerHTML = "";

    if (!courseArray.length) {
      listContainer.innerHTML = `<p style="color:white;">No courses found.</p>`;
      return;
    }

    courseArray.forEach(course => {
      const card = document.createElement("div");
      card.className = "course-product";
      card.style.cursor = "pointer";

      card.innerHTML = `
        <div class="course-thumb"></div>
        <div class="course-info">
          <h3>${course.title}</h3>
          <p>${course.description}</p>
          <div class="tag-row">
            <span class="tag">${course.category}</span>
            <span class="tag">${course.difficulty}</span>
            ${
              course.available
                ? "<span class='tag available'>Available</span>"
                : "<span class='tag unavailable'>Unavailable</span>"
            }
          </div>
        </div>
      `;

      // OPEN MODAL ON CLICK
      card.addEventListener("click", () => openModal(course));

      listContainer.appendChild(card);
    });
  }

  /* MODAL FUNCTIONS */

  function openModal(course) {
    modalBody.innerHTML = `
      <div class="modal-body">
        <h2>${course.title}</h2>

        <div class="modal-tags">
          <span class="tag">${course.category}</span>
          <span class="tag">${course.difficulty}</span>
          ${
            course.available
              ? "<span class='tag available'>Available</span>"
              : "<span class='tag unavailable'>Unavailable</span>"
          }
        </div>

        <p>${course.description}</p>

        <button class="modal-enroll-btn">Enroll Now</button>
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
