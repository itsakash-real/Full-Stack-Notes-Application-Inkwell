const asyncHandler = require("../middleware/asyncHandler");
const authService = require("../services/authService");
const { success, created } = require("../utils/response");

const signup = asyncHandler(async (req, res) => {
  const result = await authService.signup(req.body);
  created(res, result, "Account created successfully");
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  success(res, result, "Login successful");
});

const getUser = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);
  success(res, { user });
});

module.exports = { signup, login, getUser };
