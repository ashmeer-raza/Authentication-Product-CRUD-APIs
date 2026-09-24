const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const { sendSuccess, sendError } = require("../utils/response");

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// POST /api/auth/register

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 409, "An account with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return sendSuccess(res, 201, "Account created successfully", {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return sendError(res, 500, "Could not create account");
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return sendError(res, 401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendError(res, 401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

    return sendSuccess(res, 200, "Login successful", {
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, 500, "Login failed");
  }
};

// POST /api/auth/refresh-token
const refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return sendError(res, 401, "Refresh token not found");
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch (err) {
      return sendError(res, 403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id).select("+refreshToken");
    if (!user || user.refreshToken !== token) {
      return sendError(res, 403, "Refresh token has been revoked");
    }

    // Issue a new access token
    const newAccessToken = generateAccessToken(user._id);

    const newRefreshToken = generateRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);

    return sendSuccess(res, 200, "Token refreshed", {
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return sendError(res, 500, "Could not refresh token");
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

    res.clearCookie("refreshToken", COOKIE_OPTIONS);

    return sendSuccess(res, 200, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return sendError(res, 500, "Logout failed");
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return sendSuccess(res, 200, "User profile fetched", {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports = { register, login, refreshToken, logout, getMe };
