//same menu for every page and mobile menu logic also

(function () {
  function menu(navRoot) {
    const menuBtn = navRoot.querySelector("#openMenu");
    if (!menuBtn) return;

    menuBtn.addEventListener("click", () => {
      navRoot.classList.toggle("mobile-open");
      menuBtn.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    });
  }
  //underline hover effect
  function underlineHoverEffect(navRoot){
    const links = navRoot.querySelectorAll(".group-link > a");

    links.forEach((link)=>{
      link.addEventListener("mouseenter",()=>{
        link.classList.remove("line-out");
        link.classList.add("line-in");
      });

      link.addEventListener("mouseleave",()=>{
        link.classList.remove("line-in");
        link.classList.add("line-out");

      });
    });
  }

  function init() {
    const placeholder = document.getElementById("site-nav");
    if (!placeholder) return;

    fetch("pieces/nav.html")
      .then((response) => {
        if (!response.ok)
          throw new Error(`Nav fetch failed: ${response.status}`);
        return response.text();
      })
      .then((html) => {
        placeholder.innerHTML = html;

        const nav = placeholder.querySelector("nav"); //navRoot
        if (!nav) return;

        menu(nav);
        underlineHoverEffect(nav);
      })
      .catch((err) => {
        console.error("Failed to load nav:", err);
      });
  }

  window.NavUI = { init };
})();
