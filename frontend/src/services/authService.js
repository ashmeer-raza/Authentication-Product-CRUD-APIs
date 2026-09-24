import axiosInstance from "./axiosInstance";

/**
 * Register a new user account.
 * @param {{ name, email, password, confirmPassword }} userData
 * @returns {Promise<{user}>} Created user (without password or tokens)
 */
export const registerAPI = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data; // { success, message, data: { user } }
};

/**
 * Login with email and password.
 * @param {{ email, password }} credentials
 * @returns {Promise<{accessToken, user}>} Access token + user profile
 */
export const loginAPI = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data; // { success, message, data: { accessToken, user } }
};

/**
 * Refresh the access token using the httpOnly refresh token cookie.
 * No body needed — cookie is sent automatically.
 * @returns {Promise<{accessToken}>} New access token
 */
export const refreshTokenAPI = async () => {
  const { data } = await axiosInstance.post("/auth/refresh-token");
  return data;
};

/**
 * Logout the current user.
 * Invalidates the server-side refresh token and clears the cookie.
 * @returns {Promise<void>}
 */
export const logoutAPI = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

/**
 * Fetch the currently authenticated user's profile.
 * @returns {Promise<{user}>} User profile object
 */
export const getMeAPI = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};
