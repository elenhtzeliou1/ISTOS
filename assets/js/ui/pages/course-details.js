(function () {
  function escapeHTML(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function init() {
    if (!Array.isArray(window.COURSES)) {
      console.error("Courses data is missing! Check courses.js path");
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");
    if (!courseId) {
      console.warn("No course id found in url!");
      return;
    }

    const course = window.COURSES.find((c) => c.id === courseId);
    if (!course) {
      console.warn("Course not found for this specific id: ", courseId);
      return;
    }

    const modal = document.getElementById("subscribeModal");
    const titleModal = document.getElementById("subscribeTitle");
    const descModal = document.getElementById("subscribeDesc");
    const confirmBtn = document.getElementById("confirmSubscribeBtn");
    const subscribeBtn = document.getElementById("subscribeNowBtn");

    let lastFocus = null;

    const openModal = ({ title, desc, mode, buttonText }) => {
      // Fallback if modal is missing
      if (!modal || !titleModal || !descModal || !confirmBtn) {
        alert(`${title}\n\n${desc}`.trim());
        return;
      }

      lastFocus = document.activeElement;

      modal.dataset.mode = mode || "info";
      titleModal.textContent = title || "";
      descModal.textContent = desc || "";
      confirmBtn.textContent = buttonText || "Close";

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      confirmBtn.focus();
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      modal.dataset.mode = "info";
      lastFocus?.focus?.();
    };

    // bind modal close handlers once
    if (modal && modal.dataset.bound !== "1") {
      modal.dataset.bound = "1";

      modal.querySelectorAll("[data-close]").forEach((el) => {
        el.addEventListener("click", closeModal);
      });

      document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("is-open")) return;
        if (e.key === "Escape") closeModal();
      });

      // confirm button logic depends on mode
      confirmBtn?.addEventListener("click", () => {
        const mode = modal.dataset.mode;

        if (mode === "subscribe-confirm") {
          openModal({
            title: "Congratulations!",
            desc: `You subscribed to "${course.title}".`,
            mode: "info",
            buttonText: "Close",
          });
          return;
        }

        // lesson/info mode 
        closeModal();
      });
    }

    // ------ HEADER ------//
    const titleCourse = document.getElementById("course-title");
    const descCourse = document.getElementById("course-description");
    if (titleCourse) titleCourse.textContent = course.title;
    if (descCourse) descCourse.textContent = course.description;

    // ------- LEARNING GOALS ---------//
    const wrapper = document.getElementById("learning__goals_wrapper");
    if (wrapper && Array.isArray(course.learningGoals)) {
      wrapper.innerHTML = course.learningGoals
        .map((goal, index) => {
          const num = String(index + 1).padStart(2, "0");
          return `
            <div class="learning__goal__item">
              <span>${num}</span>
              <h5>${escapeHTML(goal.title)}</h5>
              <p>${escapeHTML(goal.text)}</p>
            </div>
          `;
        })
        .join("");
    }

    // ----- SECTIONS + LESSONS ------//
    const sectionWrapper = document.getElementById("course___section");

    if (sectionWrapper && Array.isArray(course.sections)) {
      sectionWrapper.innerHTML = course.sections
        .map((section, index) => {
          const secnum = String(index + 1).padStart(2, "0");

          const lessonsHtml = Array.isArray(section.lessons)
            ? section.lessons
                .map((lesson, li) => {
                  const lessonNum = String(li + 1).padStart(2, "0");

                  return `
                    <div class="course-module">
                      <div class="tag-row">
                        <div class="tag lesson">Lesson ${lessonNum}</div>
                        <div class="tag-line"></div>
                      </div>

                      <h1>${escapeHTML(lesson.title)}</h1>

                      <div class="tag-row">
                        <div class="tag">Duration: ${escapeHTML(
                          lesson.minutes
                        )} minutes</div>
                      </div>

                      <p>${escapeHTML(lesson.summary)}</p>
                      <a href="#" class="start-learning-btn">Start Learning</a>
                    </div>
                  `;
                })
                .join("")
            : `<p class="empty-lessons" style="color:black;">No lessons yet. Stay tuned!</p>`;

          return `
            <div class="course-modules-wrapper">
              <div class="course-modules-section-title-row">
                <h2>Section ${secnum}: ${escapeHTML(section.title)}</h2>
                <p>${escapeHTML(section.summary)}</p>
              </div>

              <div class="course-model-slider">
                ${lessonsHtml}
              </div>
            </div>
          `;
        })
        .join("");

      // init drag for each slider
      window.CardCarouselDrag?.init?.(".course-model-slider");
    }

    // ✅ Start Learning → modal (bind AFTER HTML injected)
    if (sectionWrapper && sectionWrapper.dataset.lessonModalBound !== "1") {
      sectionWrapper.dataset.lessonModalBound = "1";

      sectionWrapper.addEventListener("click", (e) => {
        const btn = e.target.closest(".start-learning-btn");
        if (!btn) return;

        e.preventDefault();

        const card = btn.closest(".course-module");
        const lessonTitle =
          card?.querySelector("h1")?.textContent?.trim() || "Lesson";
        const minutesText =
          card
            ?.querySelector(".tag-row .tag:not(.lesson)")
            ?.textContent?.trim() || "";

        openModal({
          title: "Hey!",
          desc: `You can start learning: "${lessonTitle}". ${minutesText}`.trim(),
          mode: "lesson",
          buttonText: "Close",
        });
      });
    }

    // ---- PROPOSED BOOKS -----//
    const proposedBooksSec = document.getElementById("proposed__bks");
    if (proposedBooksSec) {
      const recBooks = Array.isArray(course?.recommended?.books)
        ? course.recommended.books
        : [];

      if (!recBooks.length || !Array.isArray(window.BOOKS)) {
        proposedBooksSec.innerHTML = `<p class="empty-state">No proposed books for this course.</p>`;
      } else {
        const html = recBooks
          .map((ref) => {
            const book = window.BOOKS.find(
              (b) => String(b.id) === String(ref.id)
            );
            if (!book) return "";

            return `
              <a class="card" href="book-details.html?id=${encodeURIComponent(
                book.id
              )}">
                <div class="card-info">
                  <div class="tag-row">
                    <div class="tag">${escapeHTML(book.category)}</div>
                    <div class="tag">${escapeHTML(book.difficulty)}</div>
                  </div>
                  <h2>${escapeHTML(book.title)}</h2>
                  <p>${escapeHTML(ref.reason || "")}</p>
                </div>

                <div class="card-img-cont">
                  <img src="${escapeHTML(book.cover)}" alt="${escapeHTML(
              book.title
            )}" />
                </div>
              </a>
            `;
          })
          .join("");

        proposedBooksSec.innerHTML = html.trim()
          ? html
          : `<p class="empty-state">No proposed books for this course.</p>`;
      }
    }

    // ------ PROPOSED VIDEO ------//
    const proposedVideoSec = document.getElementById("__prop__vd");
    if (proposedVideoSec) {
      const recVideos = Array.isArray(course?.recommended?.videos)
        ? course.recommended.videos
        : [];

      if (!recVideos.length || !Array.isArray(window.VIDEOS)) {
        proposedVideoSec.innerHTML = `<p class="empty-state">No proposed video for this course.</p>`;
      } else {
        const html = recVideos
          .map((ref) => {
            const video = window.VIDEOS.find(
              (v) => String(v.id) === String(ref.id)
            );
            if (!video) return "";

            return `
              <a href="video-details.html?id=${encodeURIComponent(
                video.id
              )}" class="new-box">
                <div class="new-box-header">
                  <span>Recommended</span>
                  <h4>${escapeHTML(video.title)}</h4>
                  <h3>${escapeHTML(video.description)}</h3>
                  <p>${escapeHTML(video.category)}</p>
                </div>
                <div class="new-box-content">
                  <img src="${escapeHTML(video.cover)}" alt="${escapeHTML(
              video.title
            )}" />
                </div>
              </a>
            `;
          })
          .join("");

        proposedVideoSec.innerHTML = html.trim()
          ? html
          : `<p class="empty-state">No proposed video for this course.</p>`;
      }
    }

    // ----- QUESTIONS -----//
    const questionItems = document.querySelectorAll(
      ".courses-detail-accordion.module .accordion-item"
    );

    if (questionItems.length && Array.isArray(course.questions)) {
      questionItems.forEach((item, index) => {
        const qa = course.questions[index];
        if (!qa) {
          item.style.display = "none";
          return;
        }

        const questionSpan = item.querySelector(".course-span");
        const answerParagraph = item.querySelector(".accordion-panel-inner.qst p");

        if (questionSpan) questionSpan.textContent = qa.question;
        if (answerParagraph) answerParagraph.textContent = qa.answer;
      });
    }

    // ---- SUBSCRIBE BUTTON ----//
    if (subscribeBtn && subscribeBtn.dataset.bound !== "1") {
      subscribeBtn.dataset.bound = "1";
      subscribeBtn.addEventListener("click", (e) => {
        e.preventDefault();

        openModal({
          title: "Confirm subscription",
          desc: `Do you want to subscribe to "${course.title}"?`,
          mode: "subscribe-confirm",
          buttonText: "Confirm",
        });
      });
    }
  }

  window.CourseDetailsPage = { init };
})();
