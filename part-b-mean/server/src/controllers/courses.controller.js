const Course = require("../models/course");

/**
 * GET /api/courses
 * Returns all courses.
 * Uses .lean() for performance and normalizes difficulty field.
 */
exports.getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find().lean();
    // Normalize difficulty field (fallback to "level" if needed)
    const normalized = courses.map((c) => ({
      ...c,
      difficulty: c.difficulty || c.level,
    }));
    res.status(200).json(normalized);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/courses/:id
 * Returns a course by MongoDB _id.
 */
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: "Invalid course ID" });
  }
};

/**
 * GET /api/courses/proposed?limit=5
 * Returns proposed/recommended courses.
 *
 * Strategy:
 * - Prefer featured courses first
 * - If not enough, fill with non-featured
 * - Cap limit at 20
 */
exports.getProposedCourses = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "5", 10), 20);

    // 1) featured first
    let proposed = await Course.find({ featured: true }).limit(limit).lean();

    // 2) fill remaining if needed
    if (proposed.length < limit) {
      const remaining = limit - proposed.length;
      const excludeIds = proposed.map((c) => c._id);

      const extras = await Course.find({
        featured: { $ne: true },
        _id: { $nin: excludeIds },
      })
        .limit(remaining)
        .lean();

      proposed = proposed.concat(extras);
    }
    res.json(proposed);
  } catch (err) {
    next(err);
  }
};
