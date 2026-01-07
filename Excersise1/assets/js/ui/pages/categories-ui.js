// Categories page logic
// Handles both the index.html category preview and the full categories.html page rendering
// Wrapped in an IIFE to keep the global scope clean
(function () {
  // ---- Preview accordion for index.html ----
  function renderPreview(container, categories) {
    // Render accordion-style category previews
    container.innerHTML = categories
      .map((category, index) => {
        const panelId = `category-panel-${category.id}`;
        const triggerId = `category-trigger-${category.id}`;

        // Shorten description for preview display
        const pshort =
          category.description.length > 100
            ? category.description.slice(0, 200) + "..."
            : category.description;

        return `
      <div class="accordion-item">
          <button
            class="accordion-trigger"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="${panelId}"
            id="${triggerId}"
          >
            <span class="course-span">${category.title}</span>
            <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
          </button>

          <div
            class="accordion-panel"
            id="${panelId}"
            role="region"
            aria-labelledby="${triggerId}"
          >
            <a class="accordion-panel-inner" href="categories.html#${category.slug}">
              <!-- Hidden / expandable content -->
              <p>
                ${pshort}
              </p>
              <h2 class="h2-arrow"> Learn More <i class="fa-solid fa-arrow-right arrow"></i></h2>
              ${
                category.cover
                  ? `   
                <div class="accordion-pannel-inner-img-cont">
                    <img
                        src="${category.cover}"
                        alt="${category.title}"
                    />
                </div>
                `
                  : "No cover found!"
              }
            </a>
          </div>
        </div>
    `;
      })
      .join("");
  }

  // ---- Header carousel preview for categories.html ----
  function headerPreview(container, categories) {
    // Render ring-carousel items for category header
    container.innerHTML = categories
      .map((category, index) => {
        // Short description for carousel cards
        const pshort =
          category.description.length > 100
            ? category.description.slice(0, 100) + "..."
            : category.description;

        const href = `#${category.slug}`;
        const num = String(index + 1).padStart(2, "0");

        // Predefined background colors for cards
        const colors = ["#492db3", "#adadadff", "#151313", "#a1ff62"];

        // Convert hex color to RGB
        function hexToRgb(hex) {
          const h = hex.replace("#", "").slice(0, 6);
          const n = parseInt(h, 16);
          return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
        }

        // Pick readable text color based on background brightness
        function pickTextColor(bgHex) {
          const { r, g, b } = hexToRgb(bgHex);
          const brightness = (r * 299 + g * 587 + b * 114) / 1000;
          return brightness < 140 ? "#ffffff" : "#000000";
        }

        const bg = colors[index % colors.length];
        const pcolor = pickTextColor(bg);

        return `
          <a class="goal-item" href="${href}" style="--card-color-bg:${bg}; --pcolor:${pcolor};">
            <span>${num}</span>
            <h5>${category.title}</h5>
            <p>${pshort}</p>
            <div class="goal-item__bg_img_wrapper">
              <img src="${category.cover}" alt="">
            </div>
          </a>
        `;
      })
      .join("");
  }

  // ---- Recommendation selection logic ----
  function pickRecommendations(categorySlug) {
    // Ensure required datasets are loaded
    if (typeof COURSES === "undefined" || typeof BOOKS === "undefined") {
      return { course: null, books: [] };
    }

    // Pick one available course (prefer featured)
    const courseCandidates = COURSES.filter(
      (c) => c.category === categorySlug && c.available
    );

    let course = null;
    if (courseCandidates.length) {
      const featuredCourse = courseCandidates.find((c) => c.featured);
      course = featuredCourse || courseCandidates[0];
    }

    // Pick up to two available books (prefer featured)
    const bookCandidates = BOOKS.filter(
      (b) => b.category === categorySlug && b.available
    );

    const featuredBooks = bookCandidates.filter((b) => b.featured);
    const nonFeaturedBooks = bookCandidates.filter((b) => !b.featured);

    const books = [...featuredBooks, ...nonFeaturedBooks].slice(0, 2);

    return { course, books };
  }

  // ---- Single recommendation card renderer ----
  function renderRecommendationCard(kind, item) {
    if (!item) return "";

    // Truncate description for card layout
    const shortedDesc =
      item.description && item.description.length > 140
        ? item.description.slice(0, 140) + "..."
        : item.description || "";

    const tag1 = kind === "course" ? "Course" : "Book";
    const tag2 = item.difficulty || "All levels";
    const tag3 = item.available ? "Available" : "Coming soon";

    const desiredUrl =
      kind === "course" ? "course-details.html" : "book-details.html";

    const href = `${desiredUrl}?id=${encodeURIComponent(item.id)}`;
    let bottomHtml = "";

    // Book-specific preview
    if (kind === "book") {
      bottomHtml = `
    <div class="vid-wrp vid-book">
      <img src="${item.cover || ""}" alt="${item.title || ""}">
    </div>
  `;
    } else {
      // Course-specific preview (questions teaser)
      const questions = Array.isArray(item.questions)
        ? item.questions.slice(0, 2)
        : [];
      bottomHtml = `
    <div class="vid-wrp questions-wrapper">
      ${
        questions.length
          ? `<ul class="qa-list">
              ${questions
                .map(
                  (q) =>
                    `<li class="q-item"><p class="q-question">${q.question}</p></li>`
                )
                .join("")}
            </ul>`
          : `<div class="vid-placeholder"></div>`
      }
    </div>
  `;
    }

    return `
      <a class="course-desc-sticky-container" href="${href}">
        <div class="tag-row">
          <div class="tag">${tag1}</div>
          <div class="tag">${tag3}</div>
          <div class="tag">${tag2}</div>
        </div>
        <h1>${item.title}</h1>
        <p>${shortedDesc}</p>
        ${bottomHtml}
      </a>
    `;
  }

  // ---- Recommendations section renderer ----
  function renderRecommendationsSection(category) {
    const { course, books } = pickRecommendations(category.slug);

    // Do not render section if no recommendations exist
    if (!course && (!books || !books.length)) {
      return "";
    }

    const cardsHtml = [
      course ? renderRecommendationCard("course", course) : "",
      ...(books || []).map((b) => renderRecommendationCard("book", b)),
    ].join("");

    return `
      <div class="start">
        <h1>Where to start</h1>
        <p>
          Start with one recommended course and two books tailored to ${category.title} category.
        </p>
      </div>

      <div class="course-desc-sticky-wrapper">
        ${cardsHtml}
      </div>
    `;
  }

  // ---- Full categories content renderer (categories.html) ----
  function renderFullContent(container, categories) {
    container.innerHTML = categories
      .map((category) => {
        return `
      <section class="courses-desc-wrapper" id="${category.slug}">
        <div class="course-desc-header">
          <h1>${category.title}</h1>
          <p>
            ${category.description}
          </p>
        </div>

        <div class="course-desc-main-wrap">
          <div class="course-desc-box-wrap">
            <div class="tag-row">
              ${(category.label_list || [])
                .map((lab) => `<div class="tag"><p>${lab.label}</p></div>`)
                .join("")}
            </div>

            <div class="course-desc-info-main-wrapper">
              ${(category.info_list || [])
                .map(
                  (inf) =>
                    `<div class="course-info-container-box"><p>${inf.info}</p></div>`
                )
                .join("")}

              <div class="course-dsc-btn-wrp">
                <a href="courses.html?category=${encodeURIComponent(
                  category.slug
                )}">View Courses</a>
              </div>
            </div>
          </div>

          <div class="course-desc-box-wrap">
            <div class="round-container">
              <img src="${category.cover}" alt="${category.title}" />
            </div>
          </div>
        </div>

        ${renderRecommendationsSection(category)}
      </section>
      `;
      })
      .join("");
  }

  // ---- Page initializer ----
  function init() {
    // Guard: ensure categories data exists
    if (typeof CATEGORIES === "undefined") {
      console.error(
        "CATEGORIES data is missing! Load assets/js/data/categories.js first!"
      );
      return;
    }

    // Header carousel preview (categories.html)
    const headerPreviewCategories = document.getElementById(
      "categories-header-preview"
    );
    if (headerPreviewCategories) {
      headerPreview(headerPreviewCategories, CATEGORIES);
      window.GoalSliderHeight?.init?.(".goal-slider");
      window.RevealUI?.refresh?.();
    }

    // Index.html accordion preview
    const preview = document.getElementById("categories-accordion");
    if (preview) {
      renderPreview(preview, CATEGORIES);
      window.RevealUI?.refresh?.();
      return;
    }

    // Full categories view (categories.html main content)
    const fullView = document.getElementById("categories-full");
    if (fullView) {
      renderFullContent(fullView, CATEGORIES);
      window.RevealUI?.refresh?.();
    }
  }

  // Expose page initializer
  window.CategoriesPage = { init };
})();
