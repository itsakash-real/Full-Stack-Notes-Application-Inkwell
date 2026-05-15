// Import mongoose — our MongoDB connection library
const mongoose = require("mongoose");

// This function connects our app to MongoDB
const connectDB = async () => {
  try {
    // mongoose.connect() takes the MongoDB URI from our .env file
    // process.env.MONGO_URI reads the value from .env
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log which host we connected to
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If connection fails, log the error and EXIT the process
    // process.exit(1) means "exit with failure"
    // We exit because if DB is not connected, the app is useless
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the function so server.js can use it
module.exports = connectDB;