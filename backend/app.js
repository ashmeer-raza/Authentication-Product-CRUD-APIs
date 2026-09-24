/**
 * Express Application Entry Point
 * Sets up middleware, routes, and global error handling.
 * The actual HTTP server is in server.js (separation of concerns).
 *
 * Middleware stack (in order):
 *  1. cors        — Allow requests from the frontend dev server
 *  2. morgan      — HTTP request logger for development
 *  3. express.json— Parse JSON request bodies
 *  4. cookieParser— Parse cookies (needed for httpOnly refreshToken cookie)
 *
 * Routes:
 *  /api/auth     → authRoutes
 *  /api/products → productRoutes
 *
 * Global Error Handler:
 *  Catches any unhandled errors passed via next(err) and returns
 *  a consistent JSON error response.
 */

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const { sendError } = require("./utils/response");

const app = express();

// ─────────────────────────────────────────────
// Global Middleware
// ─────────────────────────────────────────────

// CORS — allow frontend origin and enable credentials (cookies)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Required for cookies to be sent cross-origin
  })
);

// HTTP request logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parse incoming JSON bodies (req.body)
app.use(express.json());

// Parse cookies (needed to read refreshToken httpOnly cookie)
app.use(cookieParser());

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running", timestamp: new Date() });
});

// ─────────────────────────────────────────────
// 404 Handler — no matching route found
// ─────────────────────────────────────────────
app.use((req, res) => {
  sendError(res, 404, `Route ${req.method} ${req.originalUrl} not found`);
});

// ─────────────────────────────────────────────
// Global Error Handler
// Called when any middleware/controller calls next(err)
// ─────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  sendError(
    res,
    err.status || 500,
    err.message || "Something went wrong on the server"
  );
});

module.exports = app;
