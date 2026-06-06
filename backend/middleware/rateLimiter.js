const AppError = require("../utils/AppError");

const createRateLimiter = ({ windowMs = 15 * 60 * 1000, max = 10, message = "Too many requests" } = {}) => {
  const store = new Map();

  setInterval(() => {
    const now = Date.now();
    for (const [key, { resetAt }] of store) {
      if (now > resetAt) store.delete(key);
    }
  }, 60 * 1000).unref();

  return (req, _res, next) => {
    const key = req.ip || req.connection?.remoteAddress || "unknown";
    const now = Date.now();
    const record = store.get(key);

    if (!record || now > record.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    record.count++;

    const remaining = max - record.count;
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);

    if (record.count > max) {
      return next(new AppError(`${message}. Retry in ${retryAfter}s.`, 429));
    }

    next();
  };
};

module.exports = { createRateLimiter };
