//course-details.html page
(function () {
  function escapeHTML(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  const LS = {
    ACTIVE: "ih_activeUserId",
    ENROLLMENTS: "ih_enrollments",
  };

  function getActiveUserId() {
    return localStorage.getItem(LS.ACTIVE) || "";
  }

  function loadEnrollments() {
    try {
      const raw = localStorage.getItem(LS.ENROLLMENTS);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  function saveEnrollments(items) {
    localStorage.setItem(LS.ENROLLMENTS, JSON.stringify(items));
  }

  function isEnrolled(userId, courseId) {
    if (!userId || !courseId) return false;
    const items = loadEnrollments();
    return items.some(
      (e) =>
        String(e.userId) === String(userId) &&
        String(e.courseId) === String(courseId)
    );
  }

  function enroll(userId, courseId) {
    const items = loadEnrollments();

    const exists = items.some(
      (e) =>
        String(e.userId) === String(userId) &&
        String(e.courseId) === String(courseId)
    );
    if (exists) return false;

    items.push({
      userId: String(userId),
      courseId: String(courseId),
      enrolledAt: new Date().toISOString(),
    });

    saveEnrollments(items);
    return true;
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
    const isAvailable = course.available !== false; // by default true if is missing

    const reviewTitleEl = document.querySelector(".review-form-section h1");
    const reviewSubmitBtn = document.getElementById("review-submit");

    //REVIEW FORM GATING (registered? enrolled?)
    const reviewGate = document.getElementById("review-gate");
    const reviewForm = document.getElementById("review-form");
    const ratingEl = document.getElementById("review-rating");
    const commentEl = document.getElementById("review-comment");

    let pendingLesson = null;

    //get active user name
    function getActiveUserName() {
      try {
        const uid = getActiveUserId();
        const users = JSON.parse(localStorage.getItem("ih_users") || "[]");
        return (
          users.find((u) => String(u.id) === String(uid))?.userName || "User"
        );
      } catch {
        return "User";
      }
    }

    function setGateMessage({ text, linkHref, linkText }) {
      if (!reviewGate) return;
      reviewGate.textContent = "";

      const p = document.createElement("p");
      p.textContent = text;
      reviewGate.appendChild(p);

      if (linkHref && linkText) {
        const a = document.createElement("a");
        a.href = linkHref;
        a.textContent = linkText;
        reviewGate.appendChild(a);
      }
    }

    function refreshReviewUI() {
      const uid = getActiveUserId();

      // Not registered
      if (!uid) {
        if (reviewForm) reviewForm.hidden = true;
        setGateMessage({
          text: "In order to leave a review you should register first.",
          linkHref: "register.html",
          linkText: "Go to Register",
        });
        return;
      }

      // Registered but NOT enrolled in this course
      if (!isEnrolled(uid, course.id)) {
        if (reviewForm) reviewForm.hidden = true;
        setGateMessage({
          text: "You must first enroll to this course in order to be able to review this course.",
        });
        return;
      }

      // Registered + enrolled => show form
      if (reviewGate) reviewGate.textContent = "";
      if (reviewForm) reviewForm.hidden = false;

      const existing = window.ReviewsUI?.getUserReview?.(course.id, uid);

      if (existing) {
        if (reviewTitleEl) reviewTitleEl.textContent = "Update your review";
        if (ratingEl) ratingEl.value = String(existing.rating ?? "");
        if (commentEl) commentEl.value = String(existing.comment ?? "");
        if (reviewSubmitBtn) reviewSubmitBtn.textContent = "Update review";
      } else {
        if (reviewTitleEl) reviewTitleEl.textContent = "Leave Your Review";
        if (ratingEl) ratingEl.value = "";
        if (commentEl) commentEl.value = "";
        if (reviewSubmitBtn) reviewSubmitBtn.textContent = "Submit review";
      }
    }

    // Bind submit once
    if (reviewForm && reviewForm.dataset.bound !== "1") {
      reviewForm.dataset.bound = "1";

      reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const uid = getActiveUserId();
        if (!uid) return; // safety

        const okEnrolled = isEnrolled(uid, course.id);
        if (!okEnrolled) {
          refreshReviewUI();
          return;
        }
        // check BEFORE saving: is it update or new review?
        const hadReview = !!window.ReviewsUI?.getUserReview?.(course.id, uid);

        const res = window.ReviewsUI?.addReview?.({
          courseId: course.id,
          userId: uid,
          userName: getActiveUserName(),
          rating: ratingEl?.value,
          comment: commentEl?.value,
        });

        if (!res?.ok) {
          alert(res?.message || "Could not save review.");
          return;
        }
        // Re-render review list + overall rating
        window.ReviewsUI?.renderForCourse?.(course.id);

        // update title/button immediately (no refresh needed)
        refreshReviewUI();

        openModal({
          title: hadReview
            ? "Review updated successfully!"
            : "Review submitted successfully!",
          desc: hadReview
            ? "Your review has been updated. Thank you for improving it!"
            : "Thanks for your review!",
          mode: "info",
          buttonText: "Close",
        });
      });
    }

    // Run once on page load
    refreshReviewUI();

    const modal = document.getElementById("subscribeModal");
    const titleModal = document.getElementById("subscribeTitle");
    const descModal = document.getElementById("subscribeDesc");
    const confirmBtn = document.getElementById("confirmSubscribeBtn");
    const subscribeBtn = document.getElementById("subscribeNowBtn");

    const uid0 = getActiveUserId();
    const alreadyEnrolled = uid0 && isEnrolled(uid0, course.id);

    if (subscribeBtn && alreadyEnrolled) {
      subscribeBtn.textContent = "Enrolled";
      subscribeBtn.setAttribute("aria-disabled", "true");
      subscribeBtn.classList.add("is-disabled");
    }

    // If course is unavailable (and user is not already enrolled), show it on the button
    if (subscribeBtn && !alreadyEnrolled && !isAvailable) {
      subscribeBtn.textContent = "Unavailable";
      subscribeBtn.setAttribute("aria-disabled", "true");
      subscribeBtn.classList.add("is-disabled");
    }

    const cancelBtn =
      modal?.querySelector(".modal__actions [data-close]") || null;

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

      // Only show Cancel on confirm mode; hide it on info/lesson modes
      if (cancelBtn) {
        const m = modal.dataset.mode;
        const showCancel = m === "subscribe-confirm";
        cancelBtn.style.display = showCancel ? "" : "none";
      }

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      confirmBtn.focus();
    };

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      modal.dataset.mode = "info";

      // reset Cancel visibility for th next time
      if (cancelBtn) cancelBtn.style.display = "";

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

        if (mode === "go-register") {
          window.location.href = "register.html";
          return;
        }

        if (mode === "subscribe-confirm") {
          // create enrollment
          const uid = getActiveUserId();

          if (!uid) {
            openModal({
              title: "Account Required!",
              desc: `Please register first.`,
              mode: "go-register",
              buttonText: "Go to Register",
            });
            return;
          }
          if (!isAvailable) {
            openModal({
              title: "Course unavailable",
              desc: `"${course.title}" is currently unavailable, so you can’t subscribe right now.`,
              mode: "info",
              buttonText: "Close",
            });
            return;
          }

          enroll(uid, course.id);
          refreshReviewUI();

          // update subscribe button UI
          if (subscribeBtn) {
            subscribeBtn.textContent = "Enrolled";
            subscribeBtn.setAttribute("aria-disabled", "true");
            subscribeBtn.classList.add("is-disabled");
          }

          // if a lesson click triggered the subscribe, continue to lesson modal
          if (pendingLesson) {
            const { lessonTitle, minutesText } = pendingLesson;
            pendingLesson = null;

            openModal({
              title: "Ready!",
              desc: `You can start learning: "${lessonTitle}". ${minutesText}`.trim(),
              mode: "lesson",
              buttonText: "Close",
            });
            return;
          }

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

    window.ReviewsUI?.renderForCourse?.(course.id);

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

    // Start Learning -> modal (bind AFTER HTML injected)
    if (sectionWrapper && sectionWrapper.dataset.lessonModalBound !== "1") {
      sectionWrapper.dataset.lessonModalBound = "1";

      sectionWrapper.addEventListener("click", (e) => {
        const btn = e.target.closest(".start-learning-btn");
        if (!btn) return;

        e.preventDefault();

        const uid = getActiveUserId();
        if (!uid) {
          openModal({
            title: "Account required",
            desc: "To access lessons, please register first.",
            mode: "go-register",
            buttonText: "Go to Register",
          });
          return;
        }
        if (!isEnrolled(uid, course.id)) {
          // save which lesson they tried to open
          const card = btn.closest(".course-module");
          const lessonTitle =
            card?.querySelector("h1")?.textContent?.trim() || "Lesson";
          const minutesText =
            card
              ?.querySelector(".tag-row .tag:not(.lesson)")
              ?.textContent?.trim() || "";

          pendingLesson = { lessonTitle, minutesText };

          openModal({
            title: "Enrollment required",
            desc: `To start learning this course, you must subscribe first.`,
            mode: "subscribe-confirm",
            buttonText: "Subscribe",
          });
          return;
        }

        //enrolled -> what we did before continue
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

    // ---- 2 PROPOSED BOOKS -----//
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
        const answerParagraph = item.querySelector(
          ".accordion-panel-inner.qst p"
        );

        if (questionSpan) questionSpan.textContent = qa.question;
        if (answerParagraph) answerParagraph.textContent = qa.answer;
      });
    }

    // ---- SUBSCRIBE BUTTON ----//
    if (subscribeBtn && subscribeBtn.dataset.bound !== "1") {
      subscribeBtn.dataset.bound = "1";
      subscribeBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (!isAvailable) {
          openModal({
            title: "Course unavailable",
            desc: `"${course.title}" is currently unavailable. Please check back later.`,
            mode: "info",
            buttonText: "Close",
          });
          return;
        }

        const uid = getActiveUserId();

        if (!uid) {
          openModal({
            title: "Account required",
            desc: "To subscribe to a course, please register (create a profile) first.",
            mode: "go-register",
            buttonText: "Go to Register",
          });
          return;
        }

        if (isEnrolled(uid, course.id)) {
          openModal({
            title: "Already enrolled",
            desc: "You already have access to this course.",
            mode: "info",
            buttonText: "Close",
          });
          return;
        }

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
