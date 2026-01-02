//menu (nav)and footer
(function () {
  const NAV_HTML = `
    <!-- TOP BAR -->
<div class="nav-top">
  <!-- MOBILE MENU ICON -->
  <div class="nav-menu" id="openMenu">
    <div class="menu-bars">
      <div class="menu-line" id="line1"></div>
      <div class="menu-line" id="line2"></div>
    </div>
    <span class="menu-span">Menu</span>
  </div>

  <!-- LOGO -->
  <h2 class="logo">
    <a href="index.html">InfoHub</a>
  </h2>

  <!-- SIGN UP BUTTON -->
 <a href="register.html" id="account-link">Register</a>
</div>

<!-- EXPANDABLE MENU (DESKTOP + MOBILE) -->
<div class="nav-link-menu" id="navLinks">
  <div class="group-link">
    <span>Explore</span>
    <a class="menu" href="categories.html">Categories</a>
    <a class="menu" href="courses.html">Courses</a>
  </div>

  <div class="group-link">
    <span>Resources</span>
    <a class="menu" href="books.html">Book List</a>
    <a class="menu" href="videos.html">Video List</a>
  </div>

  <div class="group-link">
    <span>About Us</span>
    <a class="menu" href="team.html">Team</a>
  </div>
</div>

    `;

  const FOOTER_HTML = `

<div class="footer-box">
  <div class="footer__reg">
    <h2>Join E-learning today</h2>
   <a href="register.html" id="footer-account-link">Register</a>
  </div>
</div>

<div class="footer-box">
  <div class="footer-accordion-group">
    <!--categories accordion-->
    <div class="footer-accordion-item">
      <button
        class="footer-accordion-trigger"
        data-footer-section="categories"
        aria-expanded="false"
        aria-controls="footer-cat-panel"
      >
        Categories
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </button>

      <div class="footer-accordion-panel" id="footer-cat-panel" hidden>
        <ul class="footer-link-list" id="footer-cat-list"></ul>
      </div>
    </div>

    <div class="footer-accordion-item">
      <button
        class="footer-accordion-trigger"
        data-footer-section="lists"
        aria-expanded="false"
        aria-controls="footer-lists-panel"
      >
        List
        <i class="fa-solid fa-plus" aria-hidden="true"></i>
      </button>
      <div class="footer-accordion-panel" id="footer-lists-panel" hidden>
        <ul class="footer-link-list">
          <li><a href="courses.html">Courses</a></li>
          <li><a href="books.html">Books</a></li>
          <li><a href="videos.html">Videos</a></li>
        </ul>
      </div>
    </div>

    <a href="team.html" class="footer-team-btn">About Us</a>
  </div>
</div>

<div class="footer__team-info-wrapper">
  <p>Napoleon Haralampidis 3220225 - Eleni Tzeliou 3220200</p>
  <p>Προγραμματισμός Εφαρμογών στον Ιστό 2025-2026</p>
</div>


`;

  function refreshAccountUI() {
    const activeId = localStorage.getItem("ih_activeUserId");
    const accountLink = document.getElementById("account-link");
    const footerLink = document.getElementById("footer-account-link");

    const isActive = !!activeId;

    if (accountLink)
      accountLink.textContent = isActive ? "Profile" : "Register";
    if (footerLink) footerLink.textContent = isActive ? "Profile" : "Register";

    // same URL is fine: register.html becomes profile editor when active user exists
    if (accountLink) accountLink.href = "register.html";
    if (footerLink) footerLink.href = "register.html";
  }

  function initNav(navRoot) {
    if (!navRoot || navRoot.dataset.navBound === "1") return;
    navRoot.dataset.navBound = "1";

    const menuBtn = navRoot.querySelector("#openMenu");
    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        navRoot.classList.toggle("mobile-open");
        menuBtn.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
      });
    }

    // underline hover effect (μόνο αν έχεις αντίστοιχα CSS classes)
    const links = navRoot.querySelectorAll(".group-link > a");
    links.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        link.classList.remove("line-out");
        link.classList.add("line-in");
      });
      link.addEventListener("mouseleave", () => {
        link.classList.remove("line-in");
        link.classList.add("line-out");
      });
    });
  }

  function initFooter(footerRoot) {
    if (!footerRoot || footerRoot.dataset.footerBound === "1") return;
    footerRoot.dataset.footerBound = "1";

    // accordion logic
    const triggers = footerRoot.querySelectorAll(".footer-accordion-trigger");
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const panelId = btn.getAttribute("aria-controls");
        const panel = panelId ? footerRoot.querySelector(`#${panelId}`) : null;
        if (!panel) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";

        btn.setAttribute("aria-expanded", String(!isOpen));
        panel.hidden = isOpen;

        if (!isOpen) {
          // opening
          panel.classList.add("is-open");
          panel.style.maxHeight = panel.scrollHeight + "px";
        } else {
          // closing
          panel.classList.remove("is-open");
          panel.style.maxHeight = "0px";
        }
      });
    });

    // fill categories list
    const list = footerRoot.querySelector("#footer-cat-list");
    if (list) {
      const fill = () => {
        const cats =
          window.CATEGORIES ||
          (typeof CATEGORIES !== "undefined" ? CATEGORIES : null);

        list.textContent = "";

        if (!Array.isArray(cats) || !cats.length) {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = "categories.html";
          a.textContent = "Browse categories";
          li.appendChild(a);
          list.appendChild(li);
          return;
        }

        cats.forEach((c) => {
          const li = document.createElement("li");
          const a = document.createElement("a");

          a.href = `categories.html#${encodeURIComponent(c.slug)}`;
          a.textContent = c.title;

          li.appendChild(a);
          list.appendChild(li);
        });
      };

      fill();
      window.addEventListener("load", fill, { once: true });
    }
  }

  function init() {
    const nav = document.getElementById("site-nav");
    if (nav) {
      nav.innerHTML = NAV_HTML;
      initNav(nav);
    }

    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML = FOOTER_HTML;
      initFooter(footer);
    }
    refreshAccountUI();

  }

  window.Layout = { init,refreshAccountUI  };
})();
