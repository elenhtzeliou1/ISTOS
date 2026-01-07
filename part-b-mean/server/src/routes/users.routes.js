const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const {registerUser, getMe, updateMe, checkAvailability } = require("../controllers/users.controller");

router.get("/check", checkAvailability);
router.post("/", registerUser);


//profile endpoints
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

module.exports = router;