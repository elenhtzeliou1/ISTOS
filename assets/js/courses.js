document.addEventListener("DOMContentLoaded", () => {
  const listContainer = document.getElementById("course-list");
  const categoryFilter = document.getElementById("filter-category");
  const difficultyFilter = document.getElementById("filter-difficulty");
  const availabilityFilter = document.getElementById("filter-available");

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

      listContainer.appendChild(card);
    });
  }
});
