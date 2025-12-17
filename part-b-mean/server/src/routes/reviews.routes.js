const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviews.controller");

router.post("/", reviewsController.createReview);

module.exports = router;