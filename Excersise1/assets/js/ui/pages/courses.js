// courses.html page logic
// Handles filtering, rendering, and navigation for the courses listing page
// Wrapped in an IIFE to avoid leaking variables into the global scope
(function () {
  function init() {
    // Main container that holds the rendered course cards
    const listContainer = document.getElementById("course-list");
    if (!listContainer) return;

    // Initialize shared filter sidebar / UI if available
    window.FilterUI?.init();

    // UI elements related to filtering and results count
    const resultsCount = document.getElementById("results-count");
    const categoryCheckboxes = document.querySelectorAll('input[name="filter-category"]');
    const difficultyCheckboxes = document.querySelectorAll('input[name="filter-difficulty"]');
    const availabilityFilter = document.getElementById("filter-available");

    // Guard: ensure courses data is loaded
    if (typeof COURSES === "undefined") {
      console.error("COURSES data is missing. Check courses.js path.");
      return;
    }

    // Applies all active filters to the COURSES dataset
    function applyFilters() {
      let filtered = [...COURSES];

      // Collect selected categories
      const selectedCategories = Array.from(categoryCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      // Collect selected difficulty levels
      const selectedDifficulties = Array.from(difficultyCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      // Filter by category
      if (selectedCategories.length) {
        filtered = filtered.filter((c) => selectedCategories.includes(c.category));
      }

      // Filter by difficulty
      if (selectedDifficulties.length) {
        filtered = filtered.filter((c) => selectedDifficulties.includes(c.difficulty));
      }

      // Filter by availability (if checkbox is enabled)
      if (availabilityFilter?.checked) {
        filtered = filtered.filter((c) => c.available);
      }

      renderCourses(filtered);
    }

    // Renders the given array of courses into the DOM
    function renderCourses(courseArray) {
      listContainer.innerHTML = "";

      // Update results counter
      if (resultsCount) {
        const count = courseArray.length;
        resultsCount.textContent = count === 1 ? "Course (1)" : `Courses (${count})`;
      }

      // Empty state
      if (!courseArray.length) {
        listContainer.innerHTML = `<p style="color:white;">No courses found.</p>`;
        return;
      }

      // Create a card for each course
      courseArray.forEach((course) => {
        const card = document.createElement("div");
        card.className = "course-product";
        card.style.cursor = "pointer";

        // Optional preview of up to 2 FAQ questions
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

        // Course card markup
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

        // Navigate to course details page on click
        card.addEventListener("click", () => {
          window.location.href = `course-details.html?id=${encodeURIComponent(course.id)}`;
        });

        listContainer.appendChild(card);
      });
    }

    // Bind filter change listeners
    categoryCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    difficultyCheckboxes.forEach((cb) => cb.addEventListener("change", applyFilters));
    availabilityFilter?.addEventListener("change", applyFilters);

    // Optional preset: apply category filter from URL query (?category=...)
    const params = new URLSearchParams(window.location.search);
    const initialCategory = params.get("category");
    if (initialCategory) {
      categoryCheckboxes.forEach((cb) => {
        cb.checked = cb.value === initialCategory;
      });
    }

    // Initial render (respects current checkbox state)
    requestAnimationFrame(applyFilters);

    // Re-apply filters when returning via browser back/forward cache
    window.addEventListener("pageshow", () => {
      requestAnimationFrame(applyFilters);
    });
  }

  // Expose page initializer
  window.CoursesPage = { init };
})();
