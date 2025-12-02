document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("course-list");
  const resultsCount = document.getElementById("results-count");

  const categoryCheckboxes = document.querySelectorAll(
    'input[name="filter-category"]'
  );
  const difficultyCheckboxes = document.querySelectorAll(
    'input[name="filter-difficulty"]'
  );
  const availabilityFilter = document.getElementById("filter-available");

  const filterToggleBtn = document.getElementById("filter-toggle");
  const filterSidebar = document.querySelector(".filter-sidebar");
  const filterBackdrop = document.getElementById("filter-backdrop");
  const filterCloseBtn = document.getElementById("filter-close");
  const toggleFilterMenuBtn = document.getElementById("toggle-filter-menu");

  if (toggleFilterMenuBtn && filterSidebar) {
    toggleFilterMenuBtn.addEventListener("click", () => {
      const isCollapsed = filterSidebar.classList.toggle("is-collapsed");

      // Optional: toggle button text (Greek)
      toggleFilterMenuBtn.textContent = isCollapsed
        ? "Show Filters"
        : "Hide Filters";
    });
  }

  if (!listContainer) {
    console.error("course-list element not found.");
    return;
  }

  if (typeof COURSES === "undefined") {
    console.error("COURSES data is missing. Check courses.js path.");
    return;
  }

  renderCourses(COURSES);

  // when any category checkbox changes → re-filter
  categoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  // when any difficulty checkbox changes → re-filter
  difficultyCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", applyFilters);
  });

  if (availabilityFilter) {
    availabilityFilter.addEventListener("change", applyFilters);
  }

  /* === FILTER BOTTOM SHEET LOGIC === */

  function openFilter() {
    if (!filterSidebar) return;
    filterSidebar.classList.add("is-open");
    if (filterBackdrop) filterBackdrop.classList.add("is-open");
    document.body.classList.add("no-scroll"); // optional if you want to lock scroll
  }

  function closeFilter() {
    if (!filterSidebar) return;
    filterSidebar.classList.remove("is-open");
    if (filterBackdrop) filterBackdrop.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  }

  // open on "Filters" button
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener("click", openFilter);
  }

  // close on backdrop click
  if (filterBackdrop) {
    filterBackdrop.addEventListener("click", closeFilter);
  }

  // close on X icon inside the sheet
  if (filterCloseBtn) {
    filterCloseBtn.addEventListener("click", closeFilter);
  }

  // OPTIONAL: close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFilter();
    }
  });

  function applyFilters() {
    let filtered = COURSES;

    // 1) collect selected categories
    const selectedCategories = Array.from(categoryCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    // 2) collect selected difficulties
    const selectedDifficulties = Array.from(difficultyCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    // 3) filter by category if any category is checked
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((c) =>
        selectedCategories.includes(c.category)
      );
    }

    // 4) filter by difficulty if any difficulty is checked
    if (selectedDifficulties.length > 0) {
      filtered = filtered.filter((c) =>
        selectedDifficulties.includes(c.difficulty)
      );
    }

    // 5) filter by availability
    if (availabilityFilter && availabilityFilter.checked) {
      filtered = filtered.filter((c) => c.available);
    }

    renderCourses(filtered);
  }

  function renderCourses(courseArray) {
    listContainer.innerHTML = "";

    // update results counter
    if (resultsCount) {
      const count = courseArray.length;
      resultsCount.textContent =
        count === 1 ? "Course (1)" : `Courses (${count})`;
    }

    if (!courseArray.length) {
      listContainer.innerHTML = `<p style="color:white;">No courses found.</p>`;
      return;
    }

    courseArray.forEach((course) => {
      const card = document.createElement("div");
      card.className = "course-product";
      card.style.cursor = "pointer";

      // build FAQ black box HTML
      const faqHtml =
        Array.isArray(course.faq) && course.faq.length
          ? `
        <div class="course-faq">
          ${course.faq
            .map(
              (item, index) => `
            <div class="course-faq-item">
              <span class="course-faq-index">${String(index + 1).padStart(
                2,
                "0"
              )}</span>
              <p>${item.info}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : "";

      card.innerHTML = `

      <div class="course-info">

        <div class="course-intro-info">
          <div class="tag-row">
            ${
              course.available
                ? "<span class='tag available'>Available</span>"
                : "<span class='tag unavailable'>Unavailable</span>"
            }

            <span class="tag category">${course.category}</span>
            <span class="tag category">${course.difficulty}</span>
          
          </div>
      
          <h3>${course.title}</h3>
          <p>${course.description}</p>
      
             
        </div>

       
        ${faqHtml}
      </div>
    `;

      // OPEN MODAL ON CLICK (keep as you have it)
      card.addEventListener("click", () => openModal(course));

      listContainer.appendChild(card);
    });
  }

  /* MODAL FUNCTIONS */

  function openModal(course) {
    // Build FAQ HTML if the course has extra info
    let faqHtml = "";

    if (Array.isArray(course.faq) && course.faq.length) {
      faqHtml = `
    <div class="course-faq">
      ${course.faq
        .map(
          (item, index) => `
          <div class="course-faq-item">
            <span class="course-faq-index">${String(index + 1).padStart(
              2,
              "0"
            )}</span>
            <p>${item.info}</p>
          </div>
        `
        )
        .join("")}
    </div>
  `;
    }

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

      ${faqHtml}

      <button class="modal-enroll-btn">Enroll Now</button>
    </div>
  `;

    modal.classList.add("active");
    document.body.classList.add("no-scroll");
  }
});
