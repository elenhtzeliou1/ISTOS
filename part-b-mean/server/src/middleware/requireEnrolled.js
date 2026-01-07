const Enrollment = require("../models/enrollment");

/**
 * Authorization middleware: requires enrollment in a specific course.
 *
 * Requirements:
 * - Must be used AFTER requireAuth, because it depends on:
 *     req.userId
 *
 * How it works:
 * - Reads courseId from route params:
 *     /api/reviews/course/:courseId
 * - Checks if an Enrollment exists for (userId, courseId)
 * - If not enrolled -> returns 403 Forbidden
 */
module.exports = async function requireEnrolled(req, res, next) {
  const userId = req.userId;
  const { courseId } = req.params;

  // Enrollment.exists() returns null/false if not found
  const ok = await Enrollment.exists({ user: userId, course: courseId });
  if (!ok) return res.status(403).json({ message: "Enrollment required" });
  
  // User is enrolled -> allow access to the protected controller
  next();
};
