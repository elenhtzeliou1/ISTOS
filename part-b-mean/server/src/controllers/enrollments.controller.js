const mongoose = require("mongoose");
const Enrollment = require("../models/enrollment");

/**
 * POST /api/enrollments
 * Creates an enrollment for the logged-in user.
 *
 * Auth:
 * - Requires JWT (req.userId is set by requireAuth middleware)
 *
 * Body:
 * - { "course": "<courseId>" }
 *
 * Behavior:
 * - Uses upsert so enrolling twice does not create duplicates.
 */
exports.createEnrollment = async (req, res) => {
  try {
    const userId = req.userId;
    const { course } = req.body;

    // Validate MongoDB ObjectId format
    if (!mongoose.isValidObjectId(course)) {
      return res.status(400).json({ message: "Invalid course id" });
    }

    // Create enrollment if it doesn't exist (idempotent)
    const row = await Enrollment.findOneAndUpdate(
      { user: userId, course },
      { $setOnInsert: { user: userId, course } },
      { upsert: true, new: true }
    );

    return res.status(201).json(row);
  } catch (err) {
    return res.status(400).json({ message: "Invalid Enrollment Data" });
  }
};
