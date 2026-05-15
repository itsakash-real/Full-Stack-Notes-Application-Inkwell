const express = require("express");
const router = express.Router();

// Import all controller functions
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePinNote,
  searchNotes,
} = require("../controllers/notesController");

// Import protect middleware
const { protect } = require("../middleware/authMiddleware");

// ─── APPLY PROTECT MIDDLEWARE TO ALL ROUTES ────────────────────
// router.use(protect) means EVERY route in this file requires auth
// We don't need to add protect individually to each route
router.use(protect);

// ─── ROUTE DEFINITIONS ─────────────────────────────────────────

// IMPORTANT: /search must be defined BEFORE /:id
// Otherwise Express thinks "search" is an :id value!
router.get("/search", searchNotes);

// Standard CRUD routes
router.get("/", getAllNotes);
router.post("/", createNote);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

// Pin toggle route
router.put("/:id/pin", togglePinNote);

module.exports = router;