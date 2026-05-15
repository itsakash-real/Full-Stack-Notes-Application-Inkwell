const express = require("express");

// express.Router() creates a mini-app that handles routes
// Think of it as a separate "section" of your API
const router = express.Router();

// Import controller functions (we'll create these next)
const { signup, login, getUser } = require("../controllers/authController");

// Import auth middleware (we'll create this after the controller)
const { protect } = require("../middleware/authMiddleware");

// ─── ROUTE DEFINITIONS ─────────────────────────────────────────

// POST /api/auth/signup  →  Register a new user
router.post("/signup", signup);

// POST /api/auth/login   →  Login and get JWT token
router.post("/login", login);

// GET  /api/auth/me      →  Get logged-in user's info (PROTECTED)
// protect middleware runs FIRST, then getUser runs
router.get("/me", protect, getUser);

module.exports = router;