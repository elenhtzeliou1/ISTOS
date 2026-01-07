const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews.controller");

const requireAuth = require('../middleware/requireAuth');
const requireEnrolled = require('../middleware/requireEnrolled');

// Reviews routes

// GET /api/reviews/course/:courseId
// Public endpoint: anyone can read course reviews
router.get('/course/:courseId', reviewsController.getCourseReviews); // public: anyone can read reviews


// GET /api/reviews/course/:courseId/me
// Protected endpoint: only logged-in users who are enrolled can access their own review
router.get(
  '/course/:courseId/me',
  requireAuth,
  requireEnrolled,
  reviewsController.getMyReviewForCourse
);

// PUT /api/reviews/course/:courseId
// Protected endpoint: only logged-in users who are enrolled can create/update their review
// Body: { "rating": number, "comment": string }
router.put(
  '/course/:courseId',
  requireAuth,
  requireEnrolled,
  reviewsController.upsertMyReview
);

module.exports = router;