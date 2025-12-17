const express = require("express");
const router = express.Router();
const enrollmentsController = require("../controllers/enrollments.controller");

router.post("/", enrollmentsController.createEnrollment);

module.exports = router;