const jwt = require("jsonwebtoken");

/**
 * Generate a short-lived access token.
 * @param {string} userId - MongoDB ObjectId of the user.
 * @returns {string} Signed JWT access token.
 */
const generateAccessToken = (userId) => {
  return jwt.sign(
    { id: userId }, // Payload: only user ID to keep token small
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

/**
 * Generate a long-lived refresh token.
 * @param {string} userId - MongoDB ObjectId of the user.
 * @returns {string} Signed JWT refresh token.
 */
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

/**
 * Verify an access token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload ({ id, iat, exp }).
 * @throws {JsonWebTokenError|TokenExpiredError} if invalid or expired.
 */
const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

/**
 * Verify a refresh token.
 * @param {string} token - The JWT string to verify.
 * @returns {object} Decoded payload ({ id, iat, exp }).
 * @throws {JsonWebTokenError|TokenExpiredError} if invalid or expired.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
