const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const enrollmentsController = require("../controllers/enrollments.controller"); 
const Enrollment = require("../models/enrollment");


// Enrollment routes (JWT protected)

// POST /api/enrollments
// Creates an enrollment for the logged-in user
// Body: { "course": "<courseId>" }
router.post("/", requireAuth, enrollmentsController.createEnrollment);


// GET /api/enrollments/me/enrollments
// Returns all enrollments for the logged-in user
// Includes basic course info via populate()
// Sorted by newest first
router.get("/me/enrollments", requireAuth, async (req, res) => {
  const rows = await Enrollment.find({ user: req.userId })
    .populate("course", "title slug cover")
    .sort({ createdAt: -1 });

  res.json(rows);
});

module.exports = router;