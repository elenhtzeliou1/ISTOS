(function () {
  function init() {
    //courses πρέπει να προέρχεται από assets/js/data/courses.js
    if (typeof COURSES === "undefined") {
      console.error("Courses data is missing! Check courses.js path");
      return;
    }

    // Pairnoume to id apo to url
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get("id");

    if (!courseId) {
      console.warn("No course id found in url!");
      return;
    }

    // Vriskoume to antistoixo course
    const course = COURSES.find((c) => c.id === courseId);

    if (!course) {
      console.warn("Course not found for this specific id: ", courseId);
      return;
    }

    //Gemizoume to header:
    const titleCourse = document.getElementById("course-title");
    const descCourse = document.getElementById("course-description");

    if (titleCourse) titleCourse.textContent = course.title;
    if (descCourse) descCourse.textContent = course.description;

    //Gemizoume ta learning goals
    const wrapper = document.getElementById("learning__goals_wrapper");

    if (wrapper && Array.isArray(course.learningGoals)) {
      wrapper.innerHTML = course.learningGoals
        .map((goal, index) => {
          const num = String(index + 1).padStart(2, "0");
          return `
            <div class="learning__goal__item">
              <span>${num}</span>
              <h5>${goal.title}</h5>
              <p>${goal.text}</p>
            </div>
          `;
        })
        .join("");
    }

    //Gemizoume ta modules (sections)
    const moduleEls = document.querySelectorAll(
      ".course-modules-wrapper .course-module"
    );

    if (moduleEls.length && Array.isArray(course.sections)) {
      const sections = course.sections;

      moduleEls.forEach((modEl, index) => {
        const section = sections[index];
        if (!section) return;

        const h3 = modEl.querySelector(".module-header h3");
        const span = modEl.querySelector(".module-header span");
        const p = modEl.querySelector("p");

        if (h3) h3.textContent = section.title;
        if (p) p.textContent = section.summary;

        if (span) {
          span.textContent = String(index + 1).padStart(2, "0");
        }
      });
    }

    //Gemizoume ta questions kai ta answer
    const questionItems = document.querySelectorAll(
      ".courses-detail-accordion.module .accordion-item"
    );

    if (questionItems.length && Array.isArray(course.questions)) {
      const questions = course.questions;

      questionItems.forEach((item, index) => {
        const qa = questions[index];

        //An yparxoun perissotera accordion items apo questions, ta krivoume
        if (!qa) {
          item.style.display = "none";
          return;
        }

        const questionSpan = item.querySelector(".course-span");
        const answerParagraph = item.querySelector(
          ".accordion-panel-inner.qst p"
        );

        if (questionSpan) {
          questionSpan.textContent = qa.question;
        }

        if (answerParagraph) {
          answerParagraph.textContent = qa.answer;
        }
      });
    }

    //subscribe modal confirmation
    const subscribeBtn = document.getElementById("subscribeNowBtn");
    const modal = document.getElementById("subscribeModal");
    const titleModal = document.getElementById("subscribeTitle");
    const descModal = document.getElementById("subscribeDesc");
    const confirmBtn = document.getElementById("confirmSubscribeBtn");

    if (subscribeBtn && modal && titleModal && descModal && confirmBtn) {
      let lastFocus = null;

      const openModal = () => {
        lastFocus = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        confirmBtn.focus();
      };

      const closeModal = () => {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        lastFocus?.focus?.();
      };

      subscribeBtn.addEventListener("click", (e) => {
        e.preventDefault();

        titleModal.textContent = "Confirm subscription";
        descModal.textContent = `Do you want to subscribe to "${course.title}"?`;

        confirmBtn.textContent = "Confirm";
        confirmBtn.dataset.state = "confirm";

        openModal();
      });

      confirmBtn.addEventListener("click", () => {
        if (confirmBtn.dataset.state === "done") {
          closeModal();
          return;
        }

        titleModal.textContent = "Congratulations!";
        descModal.textContent = `You subscribed to "${course.title}".`;

        confirmBtn.textContent = "Close";
        confirmBtn.dataset.state = "done";
      });

      modal.querySelectorAll("[data-close]").forEach((el) => {
        el.addEventListener("click", closeModal);
      });

      document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("is-open")) return;
        if (e.key === "Escape") closeModal();
      });
    }
  }
  window.CourseDetailsPage = { init };
})();
