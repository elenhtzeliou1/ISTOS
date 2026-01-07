// Filter menu UI controller wrapped in an IIFE to avoid polluting the global scope
// Handles mobile filter drawer behavior and desktop filter collapse logic
(function () {
  function init(options = {}) {
    // Configuration with sensible defaults for selectors, labels, and behavior
    const {
      sidebarSelector = ".filter-sidebar",
      backdropId = "filter-backdrop",
      toggleBtnId = "filter-toggle",
      closeBtnId = "filter-close",
      collapseBtnId = "toggle-filter-menu",
      textShow = "Show Filters",
      textHide = "Hide Filters",
      lockScroll = true,
    } = options;

    // Cache relevant DOM elements
    const filterSidebar = document.querySelector(sidebarSelector);
    const filterBackdrop = document.getElementById(backdropId);
    const filterToggleBtn = document.getElementById(toggleBtnId);
    const filterCloseBtn = document.getElementById(closeBtnId);
    const toggleFilterMenuBtn = document.getElementById(collapseBtnId);

    // If no sidebar exists, expose no-op controls to avoid runtime errors
    if (!filterSidebar) {
      return { open() {}, close() {} };
    }

    // Prevent double-binding across app.js and page-level modules
    // Allows safe re-initialization while keeping behavior consistent
    if (filterSidebar.dataset.filterUiBound === "1") {
      return {
        open() {
          filterSidebar.classList.add("is-open");
          filterBackdrop?.classList.add("is-open");
          if (lockScroll) document.body.classList.add("no-scroll");
        },
        close() {
          filterSidebar.classList.remove("is-open");
          filterBackdrop?.classList.remove("is-open");
          if (lockScroll) document.body.classList.remove("no-scroll");
        },
      };
    }
    filterSidebar.dataset.filterUiBound = "1";

    // Determine layout container for desktop collapse styling
    const layout =
      filterSidebar.closest(".course-layout") || document.body;

    // Opens the filter sidebar (primarily used on mobile)
    function openFilter() {
      filterSidebar.classList.add("is-open");
      filterBackdrop?.classList.add("is-open");
      if (lockScroll) document.body.classList.add("no-scroll");
    }

    // Closes the filter sidebar and restores page scroll
    function closeFilter() {
      filterSidebar.classList.remove("is-open");
      filterBackdrop?.classList.remove("is-open");
      if (lockScroll) document.body.classList.remove("no-scroll");
    }

    // Toggles collapsed state for desktop layouts
    function setCollapsed(next) {
      filterSidebar.classList.toggle("is-collapsed", next);
      layout.classList.toggle("filters-collapsed", next);

      // Update toggle button label and ARIA state for accessibility
      if (toggleFilterMenuBtn) {
        toggleFilterMenuBtn.textContent = next ? textShow : textHide;
        toggleFilterMenuBtn.setAttribute("aria-pressed", String(next));
      }
    }

    // Mobile: open and close interactions
    filterToggleBtn?.addEventListener("click", openFilter);
    filterBackdrop?.addEventListener("click", closeFilter);
    filterCloseBtn?.addEventListener("click", closeFilter);

    // Desktop: collapse/expand filter panel
    if (toggleFilterMenuBtn) {
      // Sync initial collapsed state with button text
      setCollapsed(filterSidebar.classList.contains("is-collapsed"));

      toggleFilterMenuBtn.addEventListener("click", () => {
        const next = !filterSidebar.classList.contains("is-collapsed");
        setCollapsed(next);
      });
    }

    // Allow Escape key to close the filter sidebar
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFilter();
    });

    // Expose control methods for programmatic use
    return { open: openFilter, close: closeFilter };
  }

  // Expose a minimal public API for initialization
  window.FilterUI = { init };
})();
