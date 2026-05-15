const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Step 1: Check if Authorization header exists and starts with "Bearer"
  // The frontend sends: Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5..."
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    // Step 2: Extract just the token part (remove "Bearer " prefix)
    token = req.headers.authorization.split(" ")[1];
  }

  // Step 3: If no token found, reject the request immediately
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No token provided. Please log in.",
    });
  }

  try {
    // Step 4: Verify the token using our secret key
    // jwt.verify() does two things:
    //   a) Checks if the token was signed with OUR secret (not fake)
    //   b) Checks if the token hasn't expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded looks like: { id: "64abc123...", iat: 1234567890, exp: 1235567890 }

    // Step 5: Find the user from the database using the ID inside the token
    // We exclude the password field — never carry that around
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User belonging to this token no longer exists",
      });
    }

    // Step 6: Call next() to pass control to the actual route handler
    // Without next(), the request would hang forever!
    next();
  } catch (error) {
    // jwt.verify() throws errors for:
    //   - JsonWebTokenError → token is fake/malformed
    //   - TokenExpiredError → token has expired
    console.error("Token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = { protect };