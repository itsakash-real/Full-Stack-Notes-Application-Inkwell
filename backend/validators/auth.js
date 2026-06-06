const signupRules = {
  fullName: {
    required: "Full name is required",
    type: "string",
    minLength: "Full name must be at least 2 characters",
    maxLength: "Full name cannot exceed 50 characters",
  },
  email: {
    required: "Email is required",
    type: "email",
    patternMessage: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    type: "string",
    minLength: "Password must be at least 8 characters",
    maxLength: "Password cannot exceed 128 characters",
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    patternMessage: "Password must include uppercase, lowercase, and a number",
  },
};

const loginRules = {
  email: {
    required: "Email is required",
    type: "email",
    patternMessage: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    type: "string",
  },
};

module.exports = { signupRules, loginRules };
