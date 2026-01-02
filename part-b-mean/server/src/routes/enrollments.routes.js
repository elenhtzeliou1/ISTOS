const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const enrollmentsController = require("../controllers/enrollments.controller"); 
const Enrollment = require("../models/enrollment");

// POST /api/enrollments  body: { course: courseId }
router.post("/", requireAuth, enrollmentsController.createEnrollment);

router.get("/me/enrollments", requireAuth, async (req, res) => {
  const rows = await Enrollment.find({ user: req.userId })
    .populate("course", "title slug cover")
    .sort({ createdAt: -1 });

  res.json(rows);
});

module.exports = router;