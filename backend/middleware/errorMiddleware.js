const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, _next) => {
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.error(`${err.statusCode || 500} - ${err.message}`);
    if (!err.isOperational) console.error(err.stack);
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors)
      .map((e) => e.message)
      .join(". ");
    return res.status(400).json({ success: false, message: messages });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with this information already exists",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token. Please log in again.",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expired. Please log in again.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(isDev && { error: err.message }),
  });
};

const notFound = (_req, _res, next) => {
  next(new AppError("Resource not found", 404));
};

module.exports = { errorHandler, notFound };
