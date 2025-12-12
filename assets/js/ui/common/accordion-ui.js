(function () {
  function setupInitialState(triggers) {
    triggers.forEach((btn) => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const open = btn.getAttribute("aria-expanded") === "true";
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      panel.classList.toggle("is-open", open);
    });
  }

  function bindTriggers(triggers) {
    triggers.forEach((btn) => {
      if (btn.dataset.accordionBound === "1") return;
      btn.dataset.accordionBound = "1";

      btn.addEventListener("click", () => {
        const isExpanded = btn.getAttribute("aria-expanded") === "true";
        const panelId = btn.getAttribute("aria-controls");
        const currentPanel = panelId ? document.getElementById(panelId) : null;
        if (!currentPanel) return;

        // close same if clicked again
        if (isExpanded) {
          btn.setAttribute("aria-expanded", "false");
          currentPanel.style.maxHeight = "0px";
          currentPanel.classList.remove("is-open");
          return;
        }

        // close others
        triggers.forEach((otherBtn) => {
          if (otherBtn === btn) return;

          const otherPanelId = otherBtn.getAttribute("aria-controls");
          const otherPanel = otherPanelId
            ? document.getElementById(otherPanelId)
            : null;

          otherBtn.setAttribute("aria-expanded", "false");
          if (otherPanel) {
            otherPanel.style.maxHeight = "0px";
            otherPanel.classList.remove("is-open");
          }
        });

        // open current
        btn.setAttribute("aria-expanded", "true");
        currentPanel.style.maxHeight = currentPanel.scrollHeight + "px";
        currentPanel.classList.add("is-open");
      });
    });
  }

  function init(triggerSelector = ".accordion-trigger") {
    const triggers = Array.from(document.querySelectorAll(triggerSelector));
    if (!triggers.length) return;

    setupInitialState(triggers);
    bindTriggers(triggers);
  }

  window.AccordionUI = { init };
})();
