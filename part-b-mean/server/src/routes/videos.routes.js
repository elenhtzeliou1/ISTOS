const express = require("express");
const router = express.Router();
const videosController = require("../controllers/videos.controller");

// Video routes

// GET /api/videos/proposed
// Returns proposed / recommended videos (optionally limited via query params)
router.get('/proposed', videosController.getProposedVideos);

// GET /api/videos/by-ids?ids=1,2,3
// Returns videos filtered by ids provided in the query parameter
router.get('/by-ids', videosController.getVideosByIds);

// GET /api/videos
// Returns all videos
router.get("/", videosController.getAllVideos);

// GET /api/videos/:id
// Returns a single video by MongoDB document id
router.get("/:id", videosController.getVideoById);

module.exports = router;