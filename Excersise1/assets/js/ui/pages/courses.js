(function () {
  function init() {
    const listContainer = document.getElementById("course-list");
    if (!listContainer) return;

    window.FilterUI?.init();

    const resultsCount = document.getElementById("results-count");
    const categoryCheckboxes = document.querySelectorAll('input[name="filter-category"]');
    const difficultyCheckboxes = document.querySelectorAll('input[name="filter-difficulty"]');
    const availabilityFilter = document.getElementById("filter-available");

    if (typeof COURSES === "undefined") {
      console.error("COURSES data is missing. Check courses.js path.");
      return;
    }

    function applyFilters() {
      let filtered = [...COURSES];

      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      const selectedDifficulties = Array.from(difficultyCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      if (selectedCategories.length) {
        filtered = filtered.filter((c) => selectedCategories.includes(c.category));
      }

      if (selectedDifficulties.length) {
        filtered = filtered.filter((c) => selectedDifficulties.includes(c.difficulty));
      }

      if (availabilityFilter?.checked) {
        filtered = filtered.filter((c) => c.available);
      }

      renderCourses(filtered);
    }

    function renderCourses(courseArray) {
      listContainer.innerHTML = "";

      if (resultsCount) {
        const count = courseArray.length;
        resultsCount.textContent = count === 1 ? "Course (1)" : `Courses (${count})`;
      }

      if (!courseArray.length) {
        listContainer.innerHTML = `<p style="color:white;">No courses found.</p>`;
        return;
      }

      courseArray.forEach((course) => {
        const card = document.createElement("div");
        card.className = "course-product";
        card.style.cursor = "pointer";

        const questHtml =
          Array.isArray(course.questions) && course.questions.length
            ? `
              <div class="course-faq">
                ${course.questions.slice(0, 2).map((item, index) => `
                  <div class="course-faq-item">
                    <span class="course-faq-index">${String(index + 1).padStart(2, "0")}</span>
                    <p>${item.question}</p>
                  </div>
                `).join("")}
              </div>
            `
            : "";

        card.innerHTML = `
          <div class="course-info">
            <div class="course-intro-info">
              <div class="tag-row">
                ${course.available
                  ? "<span class='tag available'>Available</span>"
                  : "<span class='tag unavailable'>Unavailable</span>"}
                <span class="tag category">${course.category}</span>
                <span class="tag category">${course.difficulty}</span>
              </div>

              <h3>${course.title}</h3>
              <p>${course.description}</p>
            </div>
            ${questHtml}
          </div>
        `;

        card.addEventListener("click", () => {
          window.location.href = `course-details.html?id=${encodeURIComponent(course.id)}`;
        });

        listContainer.appendChild(card);
      });
    }

    // Bind filter listeners
    categoryCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    difficultyCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    availabilityFilter?.addEventListener("change", applyFilters);

    // Apply ?category from URL (optional preset)
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get("category");
    if (initialCategory) {
      categoryCheckboxes.forEach((cb) => {
        cb.checked = cb.value === initialCategory;
      });
    }

    // Initial render must reflect current checkbox state
    requestAnimationFrame(applyFilters);

    // Fix Back button / bfcache restore
    window.addEventListener("pageshow", () => {
      requestAnimationFrame(applyFilters);
    });
  }

  window.CoursesPage = { init };
})();
