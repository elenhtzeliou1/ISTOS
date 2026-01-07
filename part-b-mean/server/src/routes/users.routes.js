const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const {registerUser, getMe, updateMe, checkAvailability } = require("../controllers/users.controller");

// User routes

// GET /api/users/check?email=...&userName=...
// Checks if email/username is available (used during registration)
router.get("/check", checkAvailability);


// POST /api/users
// Registers a new user
router.post("/", registerUser);


// Profile routes (JWT protected)

// GET /api/users/me
// Returns the logged-in user's profile
router.get("/me", requireAuth, getMe);

// PUT /api/users/me
// Updates the logged-in user's profile
router.put("/me", requireAuth, updateMe);

module.exports = router;