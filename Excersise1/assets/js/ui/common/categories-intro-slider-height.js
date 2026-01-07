// Goal slider height synchronizer wrapped in an IIFE to avoid leaking variables globally
// Dynamically computes and exposes the maximum card height via a CSS custom property
(function () {
  // Stores update callbacks for all initialized sliders
  const updaters = new Set();

  // Ensures global auto-refresh listeners are bound only once
  let autoBound = false;

  // Computes and sets the maximum height of goal items within a slider
  function compute(slider) {
    // Collect all goal items inside the slider
    const items = Array.from(slider.querySelectorAll(".goal-item"));
    if (!items.length) return;

    // Measure natural card height (robust against transforms like scale/rotate)
    const maxH = Math.max(...items.map((it) => it.offsetHeight));

    // Expose height as a CSS variable for layout control in stylesheets
    slider.style.setProperty("--goal-slider-h", `${Math.ceil(maxH)}px`);
  }

  // Triggers all registered slider height recomputations
  function refresh() {
    updaters.forEach((fn) => fn());
  }

  // Binds global events that may affect layout and element heights
  // This function is guarded to run only once
  function bindAutoRefreshOnce() {
    if (autoBound) return;
    autoBound = true;

    // Schedule refresh on the next animation frame for layout safety
    const rafRefresh = () => requestAnimationFrame(refresh);

    // Recalculate heights on initial load and window resize
    window.addEventListener("load", rafRefresh);
    window.addEventListener("resize", rafRefresh);

    // Handle viewport changes (mobile zoom, on-screen keyboard, etc.)
    window.visualViewport?.addEventListener("resize", rafRefresh);

    // Orientation change can cause delayed layout shifts on mobile devices
    window.addEventListener("orientationchange", () => setTimeout(refresh, 80));

    // Font loading can affect text height (notably on iPad/Safari)
    document.fonts?.ready?.then?.(refresh);

    // Handle back/forward cache restores (Safari bfcache)
    window.addEventListener("pageshow", rafRefresh);
  }

  // Initializes automatic height management for matching goal sliders
  function init(selector = ".goal-slider") {
    // Ensure global listeners are active
    bindAutoRefreshOnce();

    // Initialize each slider element only once
    document.querySelectorAll(selector).forEach((slider) => {
      if (slider._goalHBound) return;
      slider._goalHBound = true;

      // Register an updater specific to this slider
      const update = () => compute(slider);
      updaters.add(update);

      // Observe DOM mutations to react to dynamic content changes
      const mo = new MutationObserver(() => update());
      mo.observe(slider, { childList: true, subtree: true });

      // Recompute height once images inside the slider finish loading
      slider.querySelectorAll("img").forEach((img) => {
        if (!img.complete) img.addEventListener("load", update, { once: true });
      });

      // Initial computation after first paint to ensure accurate measurements
      requestAnimationFrame(update);
    });
  }

  // Expose a minimal public API for initialization and manual refresh
  window.GoalSliderHeight = { init, refresh };
})();
