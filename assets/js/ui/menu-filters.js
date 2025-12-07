(function () {
  function init(options = {}) {
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

    const filterSidebar = document.querySelector(sidebarSelector);
    const filterBackdrop = document.getElementById(backdropId);
    const filterToggleBtn = document.getElementById(toggleBtnId);
    const filterCloseBtn = document.getElementById(closeBtnId);
    const toggleFilterMenuBtn = document.getElementById(collapseBtnId);

    if (!filterSidebar) {
      return { open() {}, close() {} };
    }

    function openFilter() {
      filterSidebar.classList.add("is-open");
      if (filterBackdrop) filterBackdrop.classList.add("is-open");
      if (lockScroll) document.body.classList.add("no-scroll");
    }

    function closeFilter() {
      filterSidebar.classList.remove("is-open");
      if (filterBackdrop) filterBackdrop.classList.remove("is-open");
      if (lockScroll) document.body.classList.remove("no-scroll");
    }

    // Bottom sheet open/close (mobile)
    if (filterToggleBtn) filterToggleBtn.addEventListener("click", openFilter);
    if (filterBackdrop) filterBackdrop.addEventListener("click", closeFilter);
    if (filterCloseBtn) filterCloseBtn.addEventListener("click", closeFilter);

    // Collapse sidebar (desktop)
    if (toggleFilterMenuBtn) {
      toggleFilterMenuBtn.addEventListener("click", () => {
        const isCollapsed = filterSidebar.classList.toggle("is-collapsed");
        toggleFilterMenuBtn.textContent = isCollapsed ? textShow : textHide;
      });
    }

    // Escape closes sheet
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFilter();
    });

    return { open: openFilter, close: closeFilter };
  }

  // expose globally (no modules)
  window.FilterUI = { init };
})();