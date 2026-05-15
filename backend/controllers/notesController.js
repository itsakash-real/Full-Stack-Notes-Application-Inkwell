const Note = require("../models/Note");

// ─── CREATE NOTE ───────────────────────────────────────────────
// POST /api/notes

const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    // Create the note
    // req.user._id comes from our protect middleware
    // This automatically links the note to the logged-in user
    const note = await Note.create({
      userId: req.user._id,
      title,
      content,
      tags: tags || [],   // Use provided tags or empty array
      isPinned: false,    // New notes are always unpinned
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      error: error.message,
    });
  }
};

// ─── GET ALL NOTES ─────────────────────────────────────────────
// GET /api/notes

const getAllNotes = async (req, res) => {
  try {
    // Find ALL notes belonging to the logged-in user only
    // NEVER fetch all notes from all users — huge security flaw
    const notes = await Note.find({ userId: req.user._id })
      .sort({
        isPinned: -1,   // Pinned notes come FIRST (-1 = descending)
        updatedAt: -1,  // Then sorted by most recently updated
      });

    res.status(200).json({
      success: true,
      count: notes.length,
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

// ─── GET SINGLE NOTE ───────────────────────────────────────────
// GET /api/notes/:id

const getNoteById = async (req, res) => {
  try {
    // req.params.id is the :id from the URL
    // e.g. GET /api/notes/64abc123 → req.params.id = "64abc123"
    const note = await Note.findById(req.params.id);

    // Check if note exists
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // SECURITY CHECK — does this note belong to the logged-in user?
    // .toString() because _id is ObjectId type, req.user._id is also ObjectId
    // We compare them as strings to avoid type mismatch
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't own this note.",
      });
    }

    res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
};

// ─── UPDATE NOTE ───────────────────────────────────────────────
// PUT /api/notes/:id

const updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Find the note first to verify ownership
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Security: Only the owner can update
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't own this note.",
      });
    }

    // Build update object — only include fields that were actually sent
    // This way, if user only sends title, content stays unchanged
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (tags !== undefined) updateData.tags = tags;

    // findByIdAndUpdate parameters:
    //   1. ID to find
    //   2. What to update ($set replaces only the fields we specify)
    //   3. Options: new → return updated doc, runValidators → run schema validation
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
};

// ─── DELETE NOTE ───────────────────────────────────────────────
// DELETE /api/notes/:id

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Security: Only the owner can delete
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't own this note.",
      });
    }

    await Note.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

// ─── TOGGLE PIN NOTE ───────────────────────────────────────────
// PUT /api/notes/:id/pin

const togglePinNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    // Security: Only the owner can pin
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You don't own this note.",
      });
    }

    // Toggle: if pinned → unpin, if unpinned → pin
    // The ! operator flips a boolean: !true = false, !false = true
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: { isPinned: !note.isPinned } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Note ${updatedNote.isPinned ? "pinned" : "unpinned"} successfully`,
      note: updatedNote,
    });
  } catch (error) {
    console.error("Pin note error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle pin",
      error: error.message,
    });
  }
};

// ─── SEARCH NOTES ──────────────────────────────────────────────
// GET /api/notes/search?q=keyword

const searchNotes = async (req, res) => {
  try {
    // req.query contains URL query parameters
    // GET /api/notes/search?q=meeting → req.query.q = "meeting"
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please provide a search query using ?q=keyword",
      });
    }

    // Search using MongoDB's $text operator (uses our text index)
    // AND filter by userId so users only search their own notes
    const notes = await Note.find({
      userId: req.user._id,
      $or: [
        // $regex allows partial matching (like SQL LIKE '%keyword%')
        // "i" flag = case-insensitive
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    }).sort({ isPinned: -1, updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      query: q,
      notes,
    });
  } catch (error) {
    console.error("Search notes error:", error);
    res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePinNote,
  searchNotes,
};