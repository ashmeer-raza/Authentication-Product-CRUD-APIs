const User = require("../models/User");
const { verifyAccessToken } = require("../utils/jwt");
const { sendError } = require("../utils/response");

const authenticate = async (req, res, next) => {
  try {
    // Step 1: Read the Authorization header
    const authHeader = req.headers["authorization"];

    // Step 2: Check it exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendError(res, 401, "Access token missing or malformed");
    }

    // Step 3: Extract just the token string
    const token = authHeader.split(" ")[1];

    // Step 4: Verify token — this throws if expired or invalid
    const decoded = verifyAccessToken(token);

    // Step 5: Fetch the user from the database
    // We explicitly exclude password and refreshToken (which have select:false on schema)
    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 401, "User no longer exists");
    }

    // Step 6: Attach user object to request for controllers to use
    req.user = user;

    // Step 7: Proceed to the next middleware or controller
    next();
  } catch (error) {
    // Handle token expired or invalid signature specifically
    if (error.name === "TokenExpiredError") {
      return sendError(res, 401, "Access token expired — please refresh");
    }
    if (error.name === "JsonWebTokenError") {
      return sendError(res, 401, "Invalid access token");
    }
    // Any other unexpected error
    return sendError(res, 500, "Authentication error");
  }
};

module.exports = authenticate;
