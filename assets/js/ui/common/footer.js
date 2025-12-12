(function () {
  function init() {
    const placeholder = document.getElementById("site-footer");
    if (!placeholder) return;

    fetch("pieces/footer.html")
      .then((response) => {
        if (!response.ok)
          throw new Error(`Footer fetch failed:${response.status}`);
        return response.text();
      })
      .then((html) => {
        placeholder.innerHTML = html;

        //initialize accordion
        if(window.FooterAccordion && typeof window.FooterAccordion.init === "function" ){
            window.FooterAccordion.init();
        }
      })
      .catch((error) => {
        console.error("Failed to load footer", error);
      });
  }

  window.FooterUI = { init };
})();
