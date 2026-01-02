const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews.controller");

const requireAuth = require('../middleware/requireAuth');
const requireEnrolled = require('../middleware/requireEnrolled');


router.get('/course/:courseId', reviewsController.getCourseReviews); // public: anyone can read reviews


//private: only logged in and enrolled users can write / update their own review
router.get(
  '/course/:courseId/me',
  requireAuth,
  requireEnrolled,
  reviewsController.getMyReviewForCourse
);

router.put(
  '/course/:courseId',
  requireAuth,
  requireEnrolled,
  reviewsController.upsertMyReview
);

module.exports = router;