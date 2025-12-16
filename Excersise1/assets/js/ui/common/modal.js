//modal for register.html
(function () {
  function ensureSummaryModal() {
    if (document.getElementById("summary-modal")) return;

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

  function ensureSubscribeModal() {
    if (document.getElementById("subscribeModal")) return;

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

  window.Modals = { init };
})();