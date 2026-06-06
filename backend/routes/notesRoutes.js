const express = require("express");
const router = express.Router();

const {
  createNote, getAllNotes, getNoteById,
  updateNote, deleteNote, togglePinNote, searchNotes,
} = require("../controllers/notesController");

const { protect } = require("../middleware/authMiddleware");
const { validate, validateQuery } = require("../middleware/validate");
const { createRules, updateRules, searchRules } = require("../validators/notes");

router.use(protect);

router.get("/search", validateQuery(searchRules), searchNotes);

router.get("/", getAllNotes);
router.post("/", validate(createRules), createNote);
router.get("/:id", getNoteById);
router.put("/:id", validate(updateRules), updateNote);
router.delete("/:id", deleteNote);
router.put("/:id/pin", togglePinNote);

module.exports = router;
