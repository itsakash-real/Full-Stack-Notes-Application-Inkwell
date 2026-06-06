const asyncHandler = require("../middleware/asyncHandler");
const notesService = require("../services/notesService");
const { success, created } = require("../utils/response");

const createNote = asyncHandler(async (req, res) => {
  const note = await notesService.create(req.user._id, req.body);
  created(res, { note }, "Note created successfully");
});

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await notesService.getAll(req.user._id);
  success(res, { count: notes.length, notes });
});

const getNoteById = asyncHandler(async (req, res) => {
  const note = await notesService.getById(req.user._id, req.params.id);
  success(res, { note });
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await notesService.update(req.user._id, req.params.id, req.body);
  success(res, { note }, "Note updated successfully");
});

const deleteNote = asyncHandler(async (req, res) => {
  await notesService.remove(req.user._id, req.params.id);
  success(res, {}, "Note deleted successfully");
});

const togglePinNote = asyncHandler(async (req, res) => {
  const note = await notesService.togglePin(req.user._id, req.params.id);
  success(res, { note }, `Note ${note.isPinned ? "pinned" : "unpinned"} successfully`);
});

const searchNotes = asyncHandler(async (req, res) => {
  const notes = await notesService.search(req.user._id, req.query.q);
  success(res, { count: notes.length, query: req.query.q, notes });
});

module.exports = {
  createNote, getAllNotes, getNoteById,
  updateNote, deleteNote, togglePinNote, searchNotes,
};
