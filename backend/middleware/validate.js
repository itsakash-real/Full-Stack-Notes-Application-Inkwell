const AppError = require("../utils/AppError");

const hasInjectionKeys = (obj) => {
  if (typeof obj !== "object" || obj === null) return false;
  return Object.keys(obj).some((k) => k.startsWith("$"));
};

const createValidator = (rules) => (data) => {
  const errors = [];

  if (hasInjectionKeys(data)) {
    return { valid: false, errors: ["Invalid request data"], sanitized: data };
  }

  for (const [field, checks] of Object.entries(rules)) {
    const value = data[field];

    if (checks.required && (value === undefined || value === null || (typeof value === "string" && !value.trim()))) {
      errors.push(checks.required);
      continue;
    }

    if (value === undefined || value === null || value === "") continue;

    if (checks.type === "string") {
      if (typeof value !== "string") {
        errors.push(`${field} must be a string`);
        continue;
      }
      const str = value.trim();
      if (checks.minLength && str.length < checks.minLength) errors.push(checks.minLength);
      if (checks.maxLength && str.length > checks.maxLength) errors.push(checks.maxLength);
      if (checks.pattern && !checks.pattern.test(str)) errors.push(checks.patternMessage || `Invalid ${field} format`);
      data[field] = checks.transform ? checks.transform(str) : str;
    }

    if (checks.type === "email") {
      if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push(checks.patternMessage || "Please enter a valid email address");
        continue;
      }
      data[field] = value.trim().toLowerCase();
    }

    if (checks.type === "array") {
      if (!Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        continue;
      }
      if (checks.maxItems && value.length > checks.maxItems) {
        errors.push(checks.maxItems);
        continue;
      }
      const sanitized = value
        .map((v) => String(v).trim().toLowerCase())
        .filter(Boolean)
        .slice(0, checks.maxItems || Infinity);
      data[field] = sanitized;
    }

    if (checks.type === "boolean") {
      data[field] = Boolean(value);
    }

    if (checks.custom) {
      const result = checks.custom(value, data);
      if (result !== true) errors.push(result);
    }
  }

  return { valid: errors.length === 0, errors, sanitized: data };
};

const validate = (rules) => (req, _res, next) => {
  const validator = createValidator(rules);
  const { valid, errors, sanitized } = validator(req.body);

  if (!valid) {
    return next(new AppError(errors.join("; "), 400));
  }

  const safeData = {};
  for (const key of Object.keys(rules)) {
    if (sanitized[key] !== undefined) {
      safeData[key] = sanitized[key];
    }
  }
  req.body = safeData;
  next();
};

const validateQuery = (rules) => (req, _res, next) => {
  const validator = createValidator(rules);
  const { valid, errors } = validator(req.query);

  if (!valid) {
    return next(new AppError(errors.join("; "), 400));
  }

  next();
};

module.exports = { validate, validateQuery };
