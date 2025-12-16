// footer accordion function
(function () {
  function renderFooterCategories(root) {
    if (typeof CATEGORIES === "undefined") return;

    const catlist = root.querySelector("#footer-cat-list");
    if (!catlist) return;

    catlist.innerHTML = CATEGORIES.map((category) => {
      const href = `categories.html#${category.slug}`;
      return `<li><a href="${href}"> ${category.title}</a> </li>`;
    }).join("");
  }

  function connectFooterAccordion(root) {
    const trig = root.querySelectorAll(".footer-accordion-trigger");
    if (!trig.length) return;

    trig.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.getAttribute("aria-controls");
        const panel = panelId ? root.querySelector(`#${panelId}`) : null;
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";

        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;

        if (!isOpen) {
          // open
          panel.classList.add("is-open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
          // clos
          panel.classList.remove("is-open");
          panel.style.maxHeight = "0px";
        }
      });
    });
  }

  function init() {
    const footerRoot = document.getElementById("site-footer");
    if (!footerRoot) return;

    renderFooterCategories(footerRoot);
    connectFooterAccordion(footerRoot);
  }
  window.FooterAccordion = { init };
})();
