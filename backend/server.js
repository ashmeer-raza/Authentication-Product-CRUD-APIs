/**
 * Server Entry Point
 * Loads environment variables, connects to MongoDB, then starts the HTTP server.
 * Separating server.js from app.js makes the app easier to test (import app without starting server).
 */

require("dotenv").config(); // Load .env variables FIRST — before any other imports
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start listening
const startServer = async () => {
  await connectDB(); // Ensures DB is connected before accepting requests

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
