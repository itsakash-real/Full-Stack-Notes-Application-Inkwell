const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ─── HELPER FUNCTION: Generate JWT Token ───────────────────────

// We separate this into its own function because both
// signup AND login need to generate a token
const generateToken = (userId) => {
  return jwt.sign(
    // PAYLOAD — data we want to store inside the token
    // Never put sensitive info like passwords here!
    { id: userId },

    // SECRET KEY — used to sign (encode) the token
    // Only our server knows this key
    process.env.JWT_SECRET,

    // OPTIONS
    {
      expiresIn: "7d", // Token expires in 7 days — user must re-login after this
    }
  );
};

// ─── SIGNUP CONTROLLER ─────────────────────────────────────────
// POST /api/auth/signup

const signup = async (req, res) => {
  try {
    // Step 1: Extract data from request body
    // req.body contains what the frontend sent us (JSON)
    const { fullName, email, password } = req.body;

    // Step 2: Basic validation — check all fields exist
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide fullName, email, and password",
      });
    }

    // Step 3: Check if user already exists with this email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    // Step 4: Hash the password before saving
    // bcrypt.genSalt(10) → generates a "salt" with 10 rounds
    // A salt is random data added to the password before hashing
    // More rounds = more secure BUT slower (10 is the industry standard)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Step 5: Create the new user in database
    const newUser = await User.create({
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword, // NEVER save the raw password
    });

    // Step 6: Generate JWT token for the new user
    const token = generateToken(newUser._id);

    // Step 7: Send success response
    // We send back the token immediately so the user is logged in right after signup
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
      // Notice: we do NOT send the password back, even the hashed one
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during signup",
      error: error.message,
    });
  }
};

// ─── LOGIN CONTROLLER ──────────────────────────────────────────
// POST /api/auth/login

const login = async (req, res) => {
  try {
    // Step 1: Extract credentials from request body
    const { email, password } = req.body;

    // Step 2: Check both fields exist
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Step 3: Find the user in database by email
    // If user doesn't exist → they haven't signed up
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // SECURITY TIP: Use a vague message — don't tell attackers
      // whether the email exists or the password is wrong
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 4: Compare the entered password with the stored hash
    // bcrypt.compare() re-hashes the entered password and compares
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Step 5: Password is correct — generate a fresh token
    const token = generateToken(user._id);

    // Step 6: Send success response with token
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message,
    });
  }
};

// ─── GET CURRENT USER CONTROLLER ──────────────────────────────
// GET /api/auth/me  (Protected Route)
// This runs AFTER the protect middleware adds req.user

const getUser = async (req, res) => {
  try {
    // req.user was attached by the protect middleware
    // We use .select("-password") to exclude the password from response
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { signup, login, getUser };