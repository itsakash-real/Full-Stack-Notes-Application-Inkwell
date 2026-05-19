// ─── VERCEL SERVERLESS ENTRY POINT ──────────────────────────────
// Vercel requires exporting the Express app as a module-level export.
// The app.listen() call is NOT used in serverless — Vercel manages the port.

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("../config/db");
const authRoutes = require("../routes/authRoutes");
const notesRoutes = require("../routes/notesRoutes");

// ─── DB CONNECTION ──────────────────────────────────────────────
// In serverless, we cache the DB connection so it's reused across
// warm function invocations (avoids opening a new connection every request)
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

const app = express();

// ─── CORS ────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

// ─── SECURITY HEADERS ────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// ─── DB MIDDLEWARE ───────────────────────────────────────────────
// Connect to DB before handling any request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("DB connection failed:", err.message);
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

// ─── ROUTES ──────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Inkwell Notes API",
    status: "running",
    version: "1.0.0",
  });
});

// ─── 404 HANDLER ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ─── EXPORT FOR VERCEL ───────────────────────────────────────────
module.exports = app;
