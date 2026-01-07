const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");

// Course routes

// GET /api/courses/proposed
// Returns proposed / recommended courses (optionally limited via query params)
router.get('/proposed', coursesController.getProposedCourses);

// GET /api/courses
// Returns all courses
router.get("/", coursesController.getAllCourses);


// GET /api/courses/:id
// Returns a single course by MongoDB document id (or controller-defined identifier)
router.get("/:id", coursesController.getCourseById);


module.exports = router;
