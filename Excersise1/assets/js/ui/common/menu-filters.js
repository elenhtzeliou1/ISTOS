// menu filters 
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

    //  Prevent double-binding across app.js + page modules
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

    const layout =
      filterSidebar.closest(".course-layout") || document.body;

    function openFilter() {
      filterSidebar.classList.add("is-open");
      filterBackdrop?.classList.add("is-open");
      if (lockScroll) document.body.classList.add("no-scroll");
    }

    function closeFilter() {
      filterSidebar.classList.remove("is-open");
      filterBackdrop?.classList.remove("is-open");
      if (lockScroll) document.body.classList.remove("no-scroll");
    }

    function setCollapsed(next) {
      filterSidebar.classList.toggle("is-collapsed", next);
      layout.classList.toggle("filters-collapsed", next);

      if (toggleFilterMenuBtn) {
        toggleFilterMenuBtn.textContent = next ? textShow : textHide;
        toggleFilterMenuBtn.setAttribute("aria-pressed", String(next));
      }
    }

    // Mobile open/close
    filterToggleBtn?.addEventListener("click", openFilter);
    filterBackdrop?.addEventListener("click", closeFilter);
    filterCloseBtn?.addEventListener("click", closeFilter);

    // Desktop collapse
    if (toggleFilterMenuBtn) {
      // sync initial text
      setCollapsed(filterSidebar.classList.contains("is-collapsed"));

      toggleFilterMenuBtn.addEventListener("click", () => {
        const next = !filterSidebar.classList.contains("is-collapsed");
        setCollapsed(next);
      });
    }

    // Escape closes sheet
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeFilter();
    });

    return { open: openFilter, close: closeFilter };
  }

  window.FilterUI = { init };
})();