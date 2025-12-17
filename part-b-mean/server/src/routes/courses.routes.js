const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getCourseById);

module.exports = router;
