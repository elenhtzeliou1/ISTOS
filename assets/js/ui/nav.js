document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("site-nav");

  // 1. Load the nav HTML
  fetch("pieces/nav.html")  
    .then(response => response.text())
    .then(html => {
      placeholder.innerHTML = html;

     
      const nav = placeholder.querySelector("nav");
      const menuBtn = nav.querySelector("#openMenu");

      if (menuBtn) {
        menuBtn.addEventListener("click", () => {
          nav.classList.toggle("mobile-open");
          menuBtn.classList.toggle("active");
          document.body.classList.toggle("no-scroll");
        });
      }
    })
    .catch(err => {
      console.error("Failed to load nav:", err);
    });
});
