// Accordion functionality wrapped in an IIFE to avoid polluting the global scope
// This script controls expand/collapse behavior and synchronizes with CSS transitions
(function () {
  // Sets the initial open/closed state of each accordion panel on page load
  // Reads ARIA attributes to ensure accessibility and correct visual state
  function setupInitialState(triggers) {
    triggers.forEach((btn) => {
      // Each trigger controls a panel via aria-controls
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      // Determine whether the panel should start open or closed
      const open = btn.getAttribute("aria-expanded") === "true";

      // maxHeight is used instead of display:none to allow smooth CSS transitions
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";

      // CSS helper class to reflect open state
      panel.classList.toggle("is-open", open);
    });
  }

  // Attaches click listeners to accordion triggers
  // Uses a data attribute guard to prevent double-binding
  function bindTriggers(triggers) {
    triggers.forEach((btn) => {
      // Prevent binding the same button more than once
      if (btn.dataset.accordionBound === "1") return;
      btn.dataset.accordionBound = "1";

      // Handle accordion toggle on click
      btn.addEventListener("click", () => {
        // Current expanded state based on ARIA attribute
        const isExpanded = btn.getAttribute("aria-expanded") === "true";

        // Find the panel controlled by this trigger
        const panelId = btn.getAttribute("aria-controls");
        const currentPanel = panelId ? document.getElementById(panelId) : null;
        if (!currentPanel) return;

        // If the same accordion is clicked while open, close it
        if (isExpanded) {
          btn.setAttribute("aria-expanded", "false");
          currentPanel.style.maxHeight = "0px";
          currentPanel.classList.remove("is-open");
          return;
        }

        // Close all other accordion panels to enforce single-open behavior
        triggers.forEach((otherBtn) => {
          if (otherBtn === btn) return;

          const otherPanelId = otherBtn.getAttribute("aria-controls");
          const otherPanel = otherPanelId
            ? document.getElementById(otherPanelId)
            : null;

          // Update ARIA state for accessibility
          otherBtn.setAttribute("aria-expanded", "false");
          if (otherPanel) {
            otherPanel.style.maxHeight = "0px";
            otherPanel.classList.remove("is-open");
          }
        });

        // Open the currently selected accordion panel
        btn.setAttribute("aria-expanded", "true");

        // scrollHeight ensures the panel expands exactly to its content height
        currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
        currentPanel.classList.add("is-open");
      });
    });
  }

  // Public initializer
  // Allows a custom selector but defaults to ".accordion-trigger"
  function init(triggerSelector = ".accordion-trigger") {
    // Collect all accordion triggers from the DOM
    const triggers = Array.from(document.querySelectorAll(triggerSelector));
    if (!triggers.length) return;

    // Initialize visual state first, then bind interactions
    setupInitialState(triggers);
    bindTriggers(triggers);
  }

  // Expose a minimal public API for controlled initialization
  // Keeps implementation details private
  window.AccordionUI = { init };
})();
