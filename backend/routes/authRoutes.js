const express = require("express");
const router = express.Router();

const { signup, login, getUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { signupRules, loginRules } = require("../validators/auth");

router.post("/signup", validate(signupRules), signup);
router.post("/login", validate(loginRules), login);
router.get("/me", protect, getUser);

module.exports = router;
