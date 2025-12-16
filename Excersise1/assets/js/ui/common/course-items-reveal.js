(function () {
  function init(selector = ".course-item", visibleClass = "visible") {
    const courseItems = document.querySelectorAll(selector);
    if (!courseItems.length) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add(visibleClass);
            obs.unobserve(entry.target);
          });
        },
        { threshold: 0.2 }
      );

      courseItems.forEach((item) => observer.observe(item));
    } else {
      courseItems.forEach((item) => item.classList.add(visibleClass));
    }
  }

  window.CourseItemsReveal = { init };
})();
