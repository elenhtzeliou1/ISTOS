const express = require("express");

const router = express.Router();
const videosController = require("../controllers/videos.controller");

router.get('/proposed', videosController.getProposedVideos);
router.get('/by-ids', videosController.getVideosByIds);

router.get("/", videosController.getAllVideos);
router.get("/:id", videosController.getVideoById);

module.exports = router;