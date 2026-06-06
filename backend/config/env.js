const env = {
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || "7d",
  frontendUrl: process.env.FRONTEND_URL,
  clientOrigins: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || "15") * 60 * 1000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || "10"),

  get isProduction() {
    return this.nodeEnv === "production";
  },

  get isDevelopment() {
    return this.nodeEnv === "development";
  },

  get isVercel() {
    return !!process.env.VERCEL;
  },
};

const requiredVars = ["mongoUri", "jwtSecret"];
for (const key of requiredVars) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (env.jwtSecret.length < 32) {
  throw new Error(
    `JWT_SECRET must be at least 32 characters (currently ${env.jwtSecret.length}). ` +
    `Generate one with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
  );
}

module.exports = env;
