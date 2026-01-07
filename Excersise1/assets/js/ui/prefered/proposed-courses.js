// Featured / proposed courses carousel
// Used on:
// - index.html (homepage featured courses section)
// - courses.html (top featured carousel)
// Responsible for selecting up to 5 courses and rendering them in a carousel layout

(function () {
  function init() {
    // Carousel container element
    const carousel = document.getElementById("proposed-courses-carousel");
    if (!carousel) return;

    // Ensure COURSES dataset is available
    if (typeof COURSES === "undefined") {
      console.error("COURSES not found. Check courses.js path in index.html.");
      return;
    }

    // 1) Prefer featured courses
    let proposed = COURSES.filter((c) => c.featured);

    // 2) Fallback: if fewer than 5 featured, fill with non-featured courses
    if (proposed.length < 5) {
      const extras = COURSES.filter((c) => !c.featured);
      proposed = proposed.concat(extras);
    }

    // 3) Limit to 5 total courses
    proposed = proposed.slice(0, 5);

    // Render proposed course cards inside the carousel
    carousel.innerHTML = proposed
      .map(
        (course) => `
        <a class="proposed-video-card" href="course-details.html?id=${encodeURIComponent(
          course.id
        )}">
          <div class="proposed-video-vd-wrapper">
            <img src="${course.cover || ""}" alt="${course.title}">
          </div>
          <div class="proposed-video-content">
            <p>${course.title}</p>
          </div>
        </a>
      `
      )
      .join("");
  }

  // Public API
  window.ProposedCoursesPage = { init };
})();
