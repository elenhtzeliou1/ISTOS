// Reviews UI logic
// Manages course reviews: storage, validation, rendering overall rating and review list
// Wrapped in an IIFE to keep variables scoped locally
(function () {
  // LocalStorage key for user-submitted reviews
  const LS = { USER_REVIEWS: "ih_reviews" };

  // Escapes dynamic text to prevent HTML injection in rendered reviews
  function escapeHTML(v) {
    return String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  // Validates rating value (must be a finite number between 1 and 5)
  function isValidRating(n) {
    const x = Number(n);
    return Number.isFinite(x) && x >= 1 && x <= 5;
  }

  // Load user-submitted reviews from localStorage safely
  function loadUserReviews() {
    try {
      const raw = localStorage.getItem(LS.USER_REVIEWS);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }

  // Persist reviews back to localStorage
  function saveUserReviews(items) {
    localStorage.setItem(LS.USER_REVIEWS, JSON.stringify(items));
  }

  // Get a single review for a specific (courseId, userId) pair
  function getUserReview(courseId, userId) {
    if (!courseId || !userId) return null;

    const items = loadUserReviews(); // only user-submitted reviews
    return (
      items.find(
        (r) =>
          String(r.courseId) === String(courseId) &&
          String(r.userId) === String(userId)
      ) || null
    );
  }

  // Resolve the current user's display name from localStorage
  function getCurrentUserName(userId) {
    if (!userId) return null;
    try {
      const users = JSON.parse(localStorage.getItem("ih_users") || "[]");
      const u = users.find((x) => String(x.id) === String(userId));
      return u?.userName || null;
    } catch {
      return null;
    }
  }

  // Add or update a review (one review per user per course)
  function addReview({ courseId, userId, userName, rating, comment }) {
    // Basic validation
    if (!courseId || !userId)
      return { ok: false, message: "Missing course/user." };
    if (!isValidRating(rating))
      return { ok: false, message: "Rating must be 1-5." };

    const text = String(comment || "").trim();
    if (!text) return { ok: false, message: "Comment is required." };

    const items = loadUserReviews();
    const idx = items.findIndex(
      (r) =>
        String(r.courseId) === String(courseId) &&
        String(r.userId) === String(userId)
    );

    const row = {
      courseId: String(courseId),
      userId: String(userId),
      userName: String(userName || "User"),
      rating: Number(rating),
      comment: text,
      createdAt: new Date().toISOString(),
    };

    // Update existing review or add a new one
    if (idx >= 0) items[idx] = row;
    else items.push(row);

    saveUserReviews(items);
    return { ok: true };
  }

  // Convert an ISO timestamp into a human-readable "days ago" string
  function daysAgo(isoString) {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return "Added recently";

    const diffMs = Date.now() - d.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (days <= 0) return "Added today";
    if (days === 1) return "Added 1 day ago";
    return `Added ${days} days ago`;
  }

  // Render star icons (rounded rating)
  function starsHTML(rating) {
    const r = Math.round(Number(rating) || 0);
    let out = "";
    for (let i = 1; i <= 5; i++) {
      out +=
        i <= r
          ? `<i class="fa-solid fa-star" aria-hidden="true"></i>`
          : `<i class="fa-regular fa-star" aria-hidden="true"></i>`;
    }
    return out;
  }

  // Merge static seed reviews with user-submitted reviews for a course
  function getReviewsForCourse(courseId) {
    const base = Array.isArray(window.REVIEWS) ? window.REVIEWS : [];
    const stored = loadUserReviews();

    const merged = [...base, ...stored];

    return merged
      .filter((r) => String(r.courseId) === String(courseId))
      .filter((r) => isValidRating(r.rating));
  }

  // Render overall rating summary (average + stars + count)
  function renderOverall(overallEl, reviews) {
    if (!overallEl) return;

    if (!reviews.length) {
      overallEl.innerHTML = `<p class="empty-state">No reviews for this course yet.</p>`;
      return;
    }

    const avg =
      reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviews.length;

    overallEl.innerHTML = `
      <div class="overall-rating">
        <h2>Overall Rating </h2>
        <div class="overall-rating__value">
          <strong>${avg.toFixed(1)}</strong>
          <div class="stars" aria-label="Average rating">
            ${starsHTML(avg)}
          </div>
          <span class="overall-rating__count">(${reviews.length})</span>
        </div>
      </div>
    `;
  }

  // Render individual reviews list (newest first)
  function renderList(listEl, reviews) {
    if (!listEl) return;

    if (!reviews.length) {
      listEl.innerHTML = `<p class="empty-state">Be the first to review this course.</p>`;
      return;
    }

    // Sort by creation date (descending)
    const sorted = [...reviews].sort((a, b) => {
      const da = new Date(a.createdAt).getTime() || 0;
      const db = new Date(b.createdAt).getTime() || 0;
      return db - da;
    });

    listEl.innerHTML = sorted
      .map((r) => {
        return `
          <div class="rating-item">
            <h2>${escapeHTML(getCurrentUserName(r.userId) || r.userName || "Anonymous")}</h2>
            <h6>${escapeHTML(daysAgo(r.createdAt))}</h6>
            <div class="stars" aria-label="User rating">
              ${starsHTML(r.rating)}
            </div>
            <p>${escapeHTML(r.comment || "")}</p>
          </div>
        `;
      })
      .join("");
  }

  // Public render entry point for a specific course
  function renderForCourse(courseId, opts = {}) {
    const section =
      document.getElementById(opts.sectionId || "reviews-section") || null;
    if (!section) return;

    const overallEl = section.querySelector(".overall-rating-wrapper");
    const listEl = section.querySelector(".ratings-wrapper");

    const reviews = getReviewsForCourse(courseId);

    renderOverall(overallEl, reviews);
    renderList(listEl, reviews);
  }

  // Expose a minimal API for use by course-details.js
  window.ReviewsUI = { renderForCourse, addReview, getUserReview };
})();
