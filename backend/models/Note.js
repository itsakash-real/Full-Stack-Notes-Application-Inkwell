const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    // Who owns this note?
    // This creates a RELATIONSHIP between Note and User
    // ObjectId is MongoDB's unique ID type
    // ref: "User" tells Mongoose which collection to reference
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },

    // Tags array — user can add multiple tags like ["work", "ideas", "urgent"]
    tags: {
      type: [String],  // Array of strings
      default: [],     // Default is empty array if not provided
    },

    // Is this note pinned to the top?
    isPinned: {
      type: Boolean,
      default: false,  // Notes are unpinned by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── INDEXES ─────────────────────────────────────────────────
// Add a text index on title and content for search functionality
// This lets MongoDB do fast full-text search across these fields
noteSchema.index({ title: "text", content: "text" });

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;