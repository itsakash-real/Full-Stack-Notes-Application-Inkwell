const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const env = require("../config/env");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiry });
};

const signup = async ({ fullName, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email },
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email },
  };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

module.exports = { signup, login, getUserById };
