const express = require("express");
const router = express.Router();

// Controllers
const { register, login, refreshToken, logout, getMe } = require("../controllers/authController");

// Validators (express-validator chains)
const { registerValidators, loginValidators } = require("../validators/authValidators");

// Middleware
const authenticate = require("../middleware/authenticate");
const handleValidationErrors = require("../middleware/validationHandler");

// ── Public Routes ──────────────────────────────────────────────────────────
router.post("/register", registerValidators, handleValidationErrors, register);
router.post("/login", loginValidators, handleValidationErrors, login);
router.post("/refresh-token", refreshToken); // Reads from httpOnly cookie, no body validators needed

// ── Protected Routes (require valid access token) ──────────────────────────
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

module.exports = router;
