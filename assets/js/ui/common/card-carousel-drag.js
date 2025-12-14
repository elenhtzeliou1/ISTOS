(function () {
  function attachDrag(slider) {
    // Avoid double-binding
    if (slider.dataset.dragBound === "1") return;
    slider.dataset.dragBound = "1";

    const DRAG_THRESHOLD = 5; // px
    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let velocity = 0;
    let momentumId = null;
    let suppressClick = false;

    const getX = (e) =>
      e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;

    const cancelMomentum = () => {
      if (momentumId) cancelAnimationFrame(momentumId);
      momentumId = null;
    };

    // stop native drag the a&&img
    slider.addEventListener("dragstart", (e) => e.preventDefault(), true);

    // cancel click only if we dragged
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

    const start = (e) => {
      // left click only
      if (!("touches" in e) && e.button !== 0) return;

      isDown = true;
      isDragging = false;
      suppressClick = false;
      cancelMomentum();

      startX = lastX = getX(e);
      velocity = 0;
    };

    const move = (e) => {
      if (!isDown) return;

      const x = getX(e);
      const total = x - startX;

      //only become a drag after threshold
      if (!isDragging) {
        if (Math.abs(total) < DRAG_THRESHOLD) return;
        isDragging = true;
        slider.classList.add("active");
      }

      if (e.cancelable) e.preventDefault();

      const dx = x - lastX;
      slider.scrollLeft -= dx;
      velocity = dx;
      lastX = x;
    };

    const end = () => {
      if (!isDown) return;
      isDown = false;

      // if we never dragged, allow normal click
      if (!isDragging) return;

      slider.classList.remove("active");

      // block the click that fires after mouseup/touchend
      suppressClick = true;
      setTimeout(() => (suppressClick = false), 0);

      let momentum = velocity;

      const step = () => {
        momentum *= 0.95;
        if (Math.abs(momentum) < 0.1) return;

        slider.scrollLeft -= momentum;
        momentumId = requestAnimationFrame(step);
      };

      momentumId = requestAnimationFrame(step);
    };

    // mouse
    slider.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("mouseleave", end);

    // touch
    slider.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", end);
    window.addEventListener("touchcancel", end);
  }

  function init(selector = ".card-carousel,  .course-model-slider") {
    document.querySelectorAll(selector).forEach(attachDrag);
  }

  window.CardCarouselDrag = { init };
})();
