(function () {
  const updaters = new Set();
  let autoBound = false;

  function compute(slider) {
    const items = Array.from(slider.querySelectorAll(".goal-item"));
    if (!items.length) return;

    // measure natural card height (safe for ring transforms)
    const maxH = Math.max(...items.map((it) => it.offsetHeight));
    slider.style.setProperty("--goal-slider-h", `${Math.ceil(maxH)}px`);
  }

  function refresh() {
    updaters.forEach((fn) => fn());
  }

  function bindAutoRefreshOnce() {
    if (autoBound) return;
    autoBound = true;

    const rafRefresh = () => requestAnimationFrame(refresh);

    window.addEventListener("load", rafRefresh);
    window.addEventListener("resize", rafRefresh);
    window.visualViewport?.addEventListener("resize", rafRefresh);
    window.addEventListener("orientationchange", () => setTimeout(refresh, 80));

    // fonts can change heights (iPad)
    document.fonts?.ready?.then?.(refresh);

    // bfcache back navigation (Safari)
    window.addEventListener("pageshow", rafRefresh);
  }

  function init(selector = ".goal-slider") {
    bindAutoRefreshOnce();

    document.querySelectorAll(selector).forEach((slider) => {
      if (slider._goalHBound) return;
      slider._goalHBound = true;

      const update = () => compute(slider);
      updaters.add(update);

      // update when items are injected/changed
      const mo = new MutationObserver(() => update());
      mo.observe(slider, { childList: true, subtree: true });

      // update after images load inside slider
      slider.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", update, { once: true });
      });

      // first run after paint
      requestAnimationFrame(update);
    });
  }

  window.GoalSliderHeight = { init, refresh };
})();
