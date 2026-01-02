const Enrollment = require("../models/enrollment");

module.exports = async function requireEnrolled(req, res, next) {
  const userId = req.userId;
  const { courseId } = req.params;

  const ok = await Enrollment.exists({ user: userId, course: courseId });
  if (!ok) return res.status(403).json({ message: "Enrollment required" });

  next();
};