// Course items reveal animation wrapped in an IIFE to avoid global scope pollution
// Adds a CSS class when course elements enter the viewport
(function () {
  // Initializes the reveal behavior for course items
  function init(selector = ".course-item", visibleClass = "visible") {
    // Select all course items based on the provided selector
    const courseItems = document.querySelectorAll(selector);
    if (!courseItems.length) return;

    // Use IntersectionObserver when supported for efficient viewport detection
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            // Only react when the element becomes visible
            if (!entry.isIntersecting) return;

            // Add the visibility class to trigger CSS animations/transitions
            entry.target.classList.add(visibleClass);

            // Stop observing once revealed to improve performance
            obs.unobserve(entry.target);
          });
        },
        {
          // Element is considered visible when 20% enters the viewport
          threshold: 0.2
        }
      );

      // Observe each course item
      courseItems.forEach((item) => observer.observe(item));
    } else {
      // Fallback for older browsers without IntersectionObserver support
      // Immediately reveal all items
      courseItems.forEach((item) => item.classList.add(visibleClass));
    }
  }

  // Expose a minimal public API for controlled initialization
  window.CourseItemsReveal = { init };
})();
