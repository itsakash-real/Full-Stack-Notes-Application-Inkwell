const mongoose = require("mongoose");

// Define the shape/structure of a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,        // Must be a string
      required: true,      // Cannot be empty — will throw error if missing
      trim: true,          // Removes accidental leading/trailing spaces
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: true,
      unique: true,        // No two users can have the same email
      trim: true,
      lowercase: true,     // Stores email as lowercase always — "AK@gmail.com" → "ak@gmail.com"
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    // This option auto-adds two fields to every document:
    // createdAt → when the user registered
    // updatedAt → when user info was last changed
    timestamps: true,
  }
);

// Create the Model from the Schema
// "User" becomes the collection name "users" in MongoDB (auto-pluralized)
const User = mongoose.model("User", userSchema);

module.exports = User;