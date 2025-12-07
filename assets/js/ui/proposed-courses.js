document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("proposed-courses-carousel");
  if (!carousel) return;

  if (typeof COURSES === "undefined") {
    console.error("COURSES not found. Check courses.js path in index.html.");
    return;
  }

  // 1) Prefer featured
  let proposed = COURSES.filter((c) => c.featured);

  // 2) Fallback if fewer than 5 featured
  if (proposed.length < 5) {
    const extras = COURSES.filter((c) => !c.featured);
    proposed = proposed.concat(extras);
  }

  // 3) Take only 5
  proposed = proposed.slice(0, 5);

  // Render them
  carousel.innerHTML = proposed
    .map(
      (course) => `
      <div class="proposed-video-card" href="course-details.html?id=${encodeURIComponent(
        course.id
      )}">
        
        <div class="proposed-video-vd-wrapper">
          <img src="${course.cover || ""}" alt="${course.title}">
        </div>

        <div class="proposed-video-content">
          <p>${course.title}</p>
        </div>

      </div >
    `
    )
    .join("");
});
