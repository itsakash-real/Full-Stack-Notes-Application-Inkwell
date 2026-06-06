const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const notesRoutes = require("./routes/notesRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { createRateLimiter } = require("./middleware/rateLimiter");

const app = express();

app.disable("x-powered-by");

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || env.clientOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
}));

app.use(express.json({ limit: "10kb" }));

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (env.isProduction) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
    );
  }

  next();
});

const authLimiter = createRateLimiter({
  windowMs: env.rateLimitWindow,
  max: env.rateLimitMax,
  message: "Too many attempts. Please try again later.",
});

app.get("/", (_req, res) => {
  res.json({
    name: "Inkwell Notes API",
    status: "running",
    version: "1.0.0",
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/notes", notesRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
