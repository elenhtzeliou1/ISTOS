// Auth routes (login / token issuing)
const router = require("express").Router();
const { login } = require("../controllers/auth.controller");

// POST /api/auth/login
// Authenticates user credentials and returns a JWT token
router.post("/login", login);

module.exports = router;

