require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const start = async () => {
  await connectDB();

  if (!env.isVercel) {
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  }
};

start();
