require("dotenv").config();

const app = require("../app");
const connectDB = require("../config/db");

let connected = false;

app.use(async (_req, res, next) => {
  try {
    if (!connected) {
      await connectDB();
      connected = true;
    }
    next();
  } catch (err) {
    res.status(503).json({ success: false, message: "Database unavailable" });
  }
});

module.exports = app;
