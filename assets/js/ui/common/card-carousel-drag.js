(function () {
  function attachDrag(slider) {
    let isDown = false;
    let lastX = 0;
    let velocity = 0;
    let momentumId = null;

    const getX = (e) =>
      e.touches && e.touches.length ? e.touches[0].clientX : e.clientX;

    const cancelMomentum = () => {
      if (momentumId) {
        cancelAnimationFrame(momentumId);
        momentumId = null;
      }
    };

    const start = (e) => {
      isDown = true;
      slider.classList.add("active");
      cancelMomentum();

      lastX = getX(e);
      velocity = 0;
    };

    const move = (e) => {
      if (!isDown) return;
      if (e.cancelable) e.preventDefault();

      const x = getX(e);
      const dx = x - lastX;

      slider.scrollLeft -= dx;
      velocity = dx;
      lastX = x;
    };

    const end = () => {
      if (!isDown) return;
      isDown = false;
      slider.classList.remove("active");

      let momentum = velocity;

      const step = () => {
        momentum *= 0.95;
        if (Math.abs(momentum) < 0.1) return;

        slider.scrollLeft -= momentum;
        momentumId = requestAnimationFrame(step);
      };

      momentumId = requestAnimationFrame(step);
    };

    // Avoid double-binding
    if (slider.dataset.dragBound === "1") return;
    slider.dataset.dragBound = "1";

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

  function init(selector = ".card-carousel") {
    const sliders = document.querySelectorAll(selector);
    if (!sliders.length) return;

    sliders.forEach(attachDrag);
  }

  window.CardCarouselDrag = { init };
})();
