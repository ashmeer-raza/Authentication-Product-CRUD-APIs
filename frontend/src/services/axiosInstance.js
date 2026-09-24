import axios from "axios";

// Base URL from Vite environment variable
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create the main axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send cookies (refreshToken) with every request
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;         // Prevents multiple simultaneous refresh calls
let failedQueue = [];             // Queue of requests that failed while refreshing

// Process the queue once a refresh succeeds or fails
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses unchanged

  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 errors that haven't been retried yet
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token") // Prevent infinite loop
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request and resolve once done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint — refresh token is sent automatically via cookie
        const { data } = await axiosInstance.post("/auth/refresh-token");
        const newToken = data.data.accessToken;

        // Store new token
        sessionStorage.setItem("accessToken", newToken);

        // Update the Authorization header for future requests
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // Resolve all queued requests with the new token
        processQueue(null, newToken);

        // Retry the original request
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear session and force re-login
        processQueue(refreshError, null);
        sessionStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
