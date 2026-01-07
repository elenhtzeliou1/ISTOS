const mongoose = require("mongoose");
const Review = require("../models/review");

/**
 * GET /api/reviews/course/:courseId (public)
 * Returns all reviews for a course (latest first).
 * Populates user's userName for display.
 */
exports.getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  // Validate courseId
  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  const reviews = await Review.find({ course: courseId })
    .populate("user", "userName")
    .sort({ createdAt: -1 });

  // Return only safe fields (avoid returning full user object)
  res.json(
    reviews.map((r) => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: r.user ? { _id: r.user._id, userName: r.user.userName } : null,
    }))
  );
};

/**
 * GET /api/reviews/course/:courseId/me (protected + enrolled)
 * Returns the logged-in user's review for that course, or null if none.
 */
exports.getMyReviewForCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  const review = await Review.findOne({ course: courseId, user: userId });
  res.json(review || null);
};

/**
 * PUT /api/reviews/course/:courseId (protected + enrolled)
 * Creates or updates the logged-in user's review.
 *
 * Body:
 * - { "rating": number(1-5), "comment": string }
 */
exports.upsertMyReview = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  const { rating, comment } = req.body;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  // Validate rating
  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: "Rating must be 1-5." });
  }

  // Validate comment
  const text = String(comment || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Comment is required." });
  }

  // Upsert review (one review per user per course)
  const doc = await Review.findOneAndUpdate(
    { user: userId, course: courseId },
    { $set: { rating: r, comment: text } },
    { new: true, upsert: true, runValidators: true }
  );

  res.json(doc);
};
