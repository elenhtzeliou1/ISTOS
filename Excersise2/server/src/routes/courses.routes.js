const express = require("express");
const router = express.Router();
const coursesController = require("../controllers/courses.controller");

router.get('/proposed', coursesController.getProposedCourses);//get proposed courses

router.get("/", coursesController.getAllCourses);
router.get("/:id", coursesController.getCourseById);


module.exports = router;
