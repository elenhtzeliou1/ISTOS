// Draggable carousel functionality wrapped in an IIFE to keep the global scope clean
// Used for horizontal scrolling via drag gestures (e.g. book carousel, course sections carousel)
(function () {
  // Attaches drag-to-scroll behavior to a single slider element
  function attachDrag(slider) {
    // Prevent attaching drag handlers multiple times to the same element
    if (slider.dataset.dragBound === "1") return;
    slider.dataset.dragBound = "1";

    // Minimum movement (in pixels) before a drag is recognized
    const DRAG_THRESHOLD = 5; // px

    // Internal state variables for drag tracking and momentum
    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let velocity = 0;
    let momentumId = null;
    let suppressClick = false;

    // Normalizes mouse and touch events to a single X-coordinate value
    const getX = (e) =>
      e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;

    // Stops any ongoing momentum animation
    const cancelMomentum = () => {
      if (momentumId) cancelAnimationFrame(momentumId);
      momentumId = null;
    };

    // Disable native browser drag behavior (e.g. dragging images/links)
    slider.addEventListener("dragstart", (e) => e.preventDefault(), true);

    // Suppress click events only when a drag interaction has occurred
    // Prevents accidental navigation after dragging
    slider.addEventListener(
      "click",
      (e) => {
        if (!suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      },
      true
    );

    // Handles the start of a drag interaction (mouse down or touch start)
    const start = (e) => {
      // Only respond to left mouse button (ignore right/middle clicks)
      if (!("touches" in e) && e.button !== 0) return;

      isDown = true;
      isDragging = false;
      suppressClick = false;
      cancelMomentum();

      // Initialize drag position and reset velocity
      startX = lastX = getX(e);
      velocity = 0;
    };

    // Handles pointer movement during an active drag
    const move = (e) => {
      if (!isDown) return;

      const x = getX(e);
      const total = x - startX;

      // Do not treat small movements as a drag (click tolerance)
      if (!isDragging) {
        if (Math.abs(total) < DRAG_THRESHOLD) return;
        isDragging = true;
        slider.classList.add("active");
      }

      // Prevent native scrolling when actively dragging
      if (e.cancelable) e.preventDefault();

      // Scroll the container horizontally based on movement delta
      const dx = x - lastX;
      slider.scrollLeft -= dx;
      velocity = dx;
      lastX = x;
    };

    // Handles the end of a drag interaction
    const end = () => {
      if (!isDown) return;
      isDown = false;

      // If no actual drag occurred, allow the click event to proceed normally
      if (!isDragging) return;

      slider.classList.remove("active");

      // Block the synthetic click fired after mouseup/touchend
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);

      // Apply momentum scrolling for a natural inertial effect
      let momentum = velocity;

      const step = () => {
        momentum *= 0.95;
        if (Math.abs(momentum) < 0.1) return;

        slider.scrollLeft -= momentum;
        momentumId = requestAnimationFrame(step);
      };

      momentumId = requestAnimationFrame(step);
    };

    // Mouse event bindings
    slider.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("mouseleave", end);

    // Touch event bindings
    // passive:true on touchstart allows fast scrolling detection
    // passive:false on touchmove enables preventDefault during dragging
    slider.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
  }

  // Initializes drag functionality for all matching carousel elements
  function init(selector = ".card-carousel,  .course-model-slider") {
    document.querySelectorAll(selector).forEach(attachDrag);
  }

  // Expose a minimal public API for explicit initialization
  window.CardCarouselDrag = { init };
})();
