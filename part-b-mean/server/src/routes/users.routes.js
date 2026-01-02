const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/requireAuth");
const {registerUser, getMe, updateMe} = require("../controllers/users.controller");


router.post("/", registerUser);


//profile endpoints
router.get("/me", requireAuth, getMe);
router.put("/me", requireAuth, updateMe);

module.exports = router;