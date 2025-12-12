
(function () {
  // ---- Description cards image direction + fade/slide ----
  function initDescriptionReveal() {
    const cards = document.querySelectorAll(".description-card");
    if (!cards.length) return;

    function setImageDirections() {
      cards.forEach(card => {
        const img = card.querySelector(".description-image img");
        if (!img) return;

        img.classList.add("reveal-img");
        img.classList.remove("from-left", "from-right");

        const cardRect = card.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        const cardCenter = cardRect.left + cardRect.width / 2;
        const imgCenter = imgRect.left + imgRect.width / 2;

        if (imgCenter < cardCenter) {
          img.classList.add("from-left");
        } else {
          img.classList.add("from-right");
        }
      });
    }

    requestAnimationFrame(setImageDirections);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setImageDirections, 120);
    });

    // Observe reveal-up + reveal-img
    const revealItems = document.querySelectorAll(".reveal-up, .reveal-img");
    if (!revealItems.length) return;

    // Avoid double-binding
    const itemsToObserve = Array.from(revealItems).filter(el => !el.dataset.revealBound);
    itemsToObserve.forEach(el => (el.dataset.revealBound = "1"));

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.05,
      rootMargin: "0px 0px 10% 0px"
    });

    itemsToObserve.forEach(el => observer.observe(el));
  }

  // ---- Categories accordion reveal (tablet + laptop) ----
  function initCategoriesAccordionReveal() {
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const items = document.querySelectorAll(
      ".courses-detail-accordion:not(.module) .accordion-item"
    );
    if (!items.length) return;

    // Avoid double-binding
    const newItems = Array.from(items).filter(el => !el.dataset.revealAccBound);
    if (!newItems.length) return;

    newItems.forEach((item, i) => {
      item.dataset.revealAccBound = "1";
      item.classList.add("reveal-acc");
      item.style.transitionDelay = `${i * 80}ms`;
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px 20% 0px"
    });

    newItems.forEach(item => observer.observe(item));
  }

  function init() {
    initDescriptionReveal();
    initCategoriesAccordionReveal();
  }

  // Handy if you inject more content later
  function refresh() {
    initCategoriesAccordionReveal();
  }

  window.RevealUI = {
    init,
    refresh,
    initDescriptionReveal,
    initCategoriesAccordionReveal
  };
})();
