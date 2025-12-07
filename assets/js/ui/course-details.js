document.addEventListener("DOMContentLoaded", () => {

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
  const goalItems = document.querySelectorAll(".goal-slider .goal-item");

  if (goalItems.length && Array.isArray(course.learningGoals)) {
    const goals = course.learningGoals;

    goalItems.forEach((item, index) => {
      const h5 = item.querySelector("h5");
      const p = item.querySelector("p");
      const span = item.querySelector("span");

      const goal = goals[index];

      if (!goal) return;

      if (h5) {
        h5.textContent = goal.title;
      }

      if (p && goal.text) {
        p.textContent = goal.text;
      }

      // prosarmozoume to 01,02,03
      if (span) {
        span.textContent = String(index + 1).padStart(2, "0");
      }
    });
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
});
