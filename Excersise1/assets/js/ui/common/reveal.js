// Reveal animations controller (slide-up and side-reveal effects)
// Wrapped in an IIFE to avoid polluting the global scope
(function () {
  // ---- Description cards image direction + fade/slide ----
  // Determines reveal direction for images and applies reveal-on-scroll behavior
  function initDescriptionReveal() {
    const cards = document.querySelectorAll(".description-card");
    if (!cards.length) return;

    // Computes whether each image should slide in from the left or right
    function setImageDirections() {
      cards.forEach(card => {
        const img = card.querySelector(".description-image img");
        if (!img) return;

        // Base class for reveal highlighting
        img.classList.add("reveal-img");
        img.classList.remove("from-left", "from-right");

        // Compare image center with card center
        const cardRect = card.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        const cardCenter = cardRect.left + cardRect.width / 2;
        const imgCenter = imgRect.left + imgRect.width / 2;

        // Assign reveal direction based on relative position
        if (imgCenter < cardCenter) {
          img.classList.add("from-left");
        } else {
          img.classList.add("from-right");
        }
      });
    }

    // Run after initial paint to ensure correct measurements
    requestAnimationFrame(setImageDirections);

    // Recompute directions on resize (debounced for performance)
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setImageDirections, 120);
    });

    // Observe elements that should reveal on scroll
    const revealItems = document.querySelectorAll(".reveal-up, .reveal-img");
    if (!revealItems.length) return;

    // Avoid observing the same elements multiple times
    const itemsToObserve = Array.from(revealItems).filter(el => !el.dataset.revealBound);
    itemsToObserve.forEach(el => (el.dataset.revealBound = "1"));

    // IntersectionObserver to trigger reveal animations when elements enter viewport
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Add visibility class to trigger CSS transitions
        entry.target.classList.add("is-visible");

        // Stop observing once revealed
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.10,
      rootMargin: "0px 0px 10% 0px"
    });

    itemsToObserve.forEach(el => observer.observe(el));
  }

  // ---- Categories accordion reveal (tablet + laptop) ----
  // Staggered reveal animation for accordion items on larger screens
  function initCategoriesAccordionReveal() {
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const items = document.querySelectorAll(
      ".courses-detail-accordion:not(.module) .accordion-item"
    );
    if (!items.length) return;

    // Avoid double-binding on re-initialization
    const newItems = Array.from(items).filter(el => !el.dataset.revealAccBound);
    if (!newItems.length) return;

    // Apply base reveal classes and staggered delays
    newItems.forEach((item, i) => {
      item.dataset.revealAccBound = "1";
      item.classList.add("reveal-acc");
      item.style.transitionDelay = `${i * 80}ms`;
    });

    // Observer to trigger accordion reveal animation
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: "0px 0px 20% 0px"
    });

    newItems.forEach(item => observer.observe(item));
  }

  // Initializes all reveal behaviors
  function init() {
    initDescriptionReveal();
    initCategoriesAccordionReveal();
  }

  // Re-initializes accordion reveal (useful when content is injected dynamically)
  function refresh() {
    initCategoriesAccordionReveal();
  }

  // Expose a small public API for initialization and refresh
  window.RevealUI = {
    init,
    refresh,
    initDescriptionReveal,
    initCategoriesAccordionReveal
  };
})();
