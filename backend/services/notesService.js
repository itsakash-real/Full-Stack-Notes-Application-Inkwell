const Note = require("../models/Note");
const AppError = require("../utils/AppError");
const mongoose = require("mongoose");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateNoteId = (id) => {
  if (!isValidObjectId(id)) {
    throw new AppError("Invalid note identifier", 400);
  }
};

const create = async (userId, data) => {
  return Note.create({
    userId,
    title: data.title,
    content: data.content,
    tags: data.tags || [],
    isPinned: false,
  });
};

const getAll = async (userId) => {
  return Note.find({ userId })
    .sort({ isPinned: -1, updatedAt: -1 })
    .select("-__v")
    .lean();
};

const getById = async (userId, noteId) => {
  validateNoteId(noteId);
  const note = await Note.findOne({ _id: noteId, userId }).select("-__v").lean();
  if (!note) throw new AppError("Note not found", 404);
  return note;
};

const update = async (userId, noteId, data) => {
  validateNoteId(noteId);

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.tags !== undefined) updateData.tags = data.tags;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { $set: updateData },
    { new: true, runValidators: true, select: "-__v" }
  );

  if (!note) throw new AppError("Note not found", 404);
  return note;
};

const remove = async (userId, noteId) => {
  validateNoteId(noteId);
  const note = await Note.findOneAndDelete({ _id: noteId, userId });
  if (!note) throw new AppError("Note not found", 404);
};

const togglePin = async (userId, noteId) => {
  validateNoteId(noteId);
  const note = await Note.findById(noteId);
  if (!note) throw new AppError("Note not found", 404);

  const updated = await Note.findOneAndUpdate(
    { _id: noteId, userId },
    { $set: { isPinned: !note.isPinned } },
    { new: true, select: "-__v" }
  );

  if (!updated) throw new AppError("Note not found", 404);
  return updated;
};

const search = async (userId, query) => {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Note.find({
    userId,
    $or: [
      { title: { $regex: escaped, $options: "i" } },
      { content: { $regex: escaped, $options: "i" } },
      { tags: { $regex: escaped, $options: "i" } },
    ],
  })
    .sort({ isPinned: -1, updatedAt: -1 })
    .select("-__v")
    .limit(100)
    .lean();
};

module.exports = { create, getAll, getById, update, remove, togglePin, search };
