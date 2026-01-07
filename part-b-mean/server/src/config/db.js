const mongoose = require("mongoose");

/**
 * Connects the application to MongoDB using Mongoose.
 *
 * Reads connection string from:
 * - process.env.MONGODB_URI
 *
 * Behavior:
 * - On success: logs a confirmation message.
 * - On failure: logs the error and terminates the process (exit code 1),
 *   because the server cannot operate without a database connection.
 */
const connectDB = async () => {
  try {
    // Establish MongoDB connection
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Log connection error and exit to avoid running the server in a broken state
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
