document.addEventListener("DOMContentLoaded", () => {
   if(window.FilterUI){
    window.FilterUI.init();
  }

  const listContainer = document.getElementById("course-list");
  const resultsCount = document.getElementById("results-count");

  const categoryCheckboxes = document.querySelectorAll(
    'input[name="filter-category"]'
  );
  const difficultyCheckboxes = document.querySelectorAll(
    'input[name="filter-difficulty"]'
  );
  const availabilityFilter = document.getElementById("filter-available");



  if (!listContainer) {
    console.error("course-list element not found.");
    return;
  }

  if (typeof COURSES === "undefined") {
    console.error("COURSES data is missing. Check courses.js path.");
    return;
  }

  // listen to ?category from url
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get("category");

  if (initialCategory) {
    //check only tin katigoria pou ir8e apo to url
    categoryCheckboxes.forEach((cb) => {
      cb.checked = cb.value === initialCategory;
    });

    applyFilters();
  } else {
    //AN DEN EXEI ER8EI KATI KANOUME APLA RENDER TA COURSES opos arxika ;)
    renderCourses(COURSES);
  }

  // listeners για φίλτρα

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

  

  function applyFilters() {
    let filtered = [...COURSES];

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
      const questHtml =
        Array.isArray(course.questions) && course.questions.length
          ? `
        <div class="course-faq">
          ${course.questions
            .slice(0, 2) // μόνο οι 2 πρώτες ερωτήσεις
            .map(
              (item, index) => `
            <div class="course-faq-item">
              <span class="course-faq-index">${String(index + 1).padStart(
                2,
                "0"
              )}</span>
              <p>${item.question}</p>
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

       
        ${questHtml}
      </div>
    `;

      // OPEN MODAL ON CLICK (keep as you have it)
      card.addEventListener("click", () => {
        window.location.href = `course-details.html?id=${encodeURIComponent(
          course.id
        )}`;
      });

      listContainer.appendChild(card);
    });
  }
});
