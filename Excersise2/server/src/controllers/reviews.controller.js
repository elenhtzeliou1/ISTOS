const mongoose = require("mongoose");
const Review = require("../models/review");

// GET /reviews/course/:courseId  (public)
exports.getCourseReviews = async (req, res) => {
  const { courseId } = req.params;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  const reviews = await Review.find({ course: courseId })
    .populate("user", "userName")
    .sort({ createdAt: -1 });

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

// GET /reviews/course/:courseId/me (auth+enrolled)
exports.getMyReviewForCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  const review = await Review.findOne({ course: courseId, user: userId });
  res.json(review || null);
};

// PUT /reviews/course/:courseId (auth+enrolled)  create-or-update
exports.upsertMyReview = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.userId;
  const { rating, comment } = req.body;

  if (!mongoose.isValidObjectId(courseId)) {
    return res.status(400).json({ message: "Invalid course id" });
  }

  const r = Number(rating);
  if (!Number.isFinite(r) || r < 1 || r > 5) {
    return res.status(400).json({ message: "Rating must be 1-5." });
  }

  const text = String(comment || "").trim();
  if (!text) {
    return res.status(400).json({ message: "Comment is required." });
  }

  const doc = await Review.findOneAndUpdate(
    { user: userId, course: courseId },
    { $set: { rating: r, comment: text } },
    { new: true, upsert: true, runValidators: true }
  );

  res.json(doc);
};
