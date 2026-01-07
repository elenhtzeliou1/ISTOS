// modal.js
// ------------------------------------------------------
// Centralized modal management for the application.
//
// Responsibilities:
// 1) Dynamically inject required modal HTML into the DOM
// 2) Ensure modals exist only once (idempotent creation)
// 3) Support different modal types depending on page context
//    - Registration summary modal (register.html)
//    - Course subscription modal (course-details.html)
//
// This file does NOT handle business logic.
// It only ensures modal structure exists and is ready to be used
// by other scripts (e.g. register-form.js).
// ------------------------------------------------------
(function () {
  // --------------------------------------------------
  // Ensures that the registration summary modal exists.
  // If it already exists in the DOM, nothing happens.
  // Otherwise, the modal HTML is injected at the end of <body>.
  // --------------------------------------------------
  function ensureSummaryModal() {
    // Guard clause: avoid duplicate modal injection
    if (document.getElementById("summary-modal")) return;

    // Inject modal markup directly into the DOM
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div id="summary-modal" class="modal-overlay">
        <div class="modal-content">
          <span id="summary-close" class="modal-close">&times;</span>

          <h2>Review Your Information</h2>
          <div id="summary-content" class="modal-body"></div>

          <button id="final-submit" class="modal-enroll-btn">
            Confirm Registration
          </button>
        </div>
      </div>
      `
    );
  }

  // --------------------------------------------------
  // Ensures that the course subscription modal exists.
  // Used on course-details.html for course enrollment.
  // --------------------------------------------------
  function ensureSubscribeModal() {
    // Guard clause: avoid duplicate modal injection
    if (document.getElementById("subscribeModal")) return;

    // Inject subscription modal HTML
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="modal" id="subscribeModal" aria-hidden="true">
        <div class="modal__backdrop" data-close></div>

        <div
          class="modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscribeTitle"
          aria-describedby="subscribeDesc"
        >
          <h2 id="subscribeTitle">Confirm subscription</h2>
          <p id="subscribeDesc"></p>

          <div class="modal__actions">
            <button type="button" class="modal__btn" data-close>Cancel</button>
            <button
              type="button"
              class="modal__btn modal__btn--primary"
              id="confirmSubscribeBtn"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      `
    );
  }

  // --------------------------------------------------
  // Initialization entry point.
  //
  // Decides which modal(s) should exist based on the
  // current page context.
  // --------------------------------------------------
  function init() {
    // Register page needs the summary modal
    if (document.getElementById("register-form")) {
      ensureSummaryModal();
    }

    // Course details page needs the subscribe modal
    if (
      document.getElementById("subscribeNowBtn") ||
      document.body.classList.contains("course-detail-page")
    ) {
      ensureSubscribeModal();
    }
  }

  // --------------------------------------------------
  // Public API
  // Exposed globally so app.js can call Modals.init()
  // --------------------------------------------------
  window.Modals = { init };
})();