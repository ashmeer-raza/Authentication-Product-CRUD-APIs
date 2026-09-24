import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginAPI, registerAPI, logoutAPI, getMeAPI } from "../services/authService";

// Create the context (default value is just a shape hint — not the real value)
export const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app to provide auth state everywhere.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]           = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true until we verify session on mount


  useEffect(() => {
    const checkSession = async () => {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await getMeAPI();
        setUser(res.data.user);
      } catch {
        // Token invalid or expired and refresh also failed — clear storage
        sessionStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const registerUser = useCallback(async (userData) => {
    const res = await registerAPI(userData);
    return res;
  }, []);

  const loginUser = useCallback(async (credentials) => {
    const res = await loginAPI(credentials);
    sessionStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
    return res;
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await logoutAPI(); // Tell server to invalidate refresh token
    } finally {
      // Always clear local state even if server call fails
      sessionStorage.removeItem("accessToken");
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user, // Boolean derived from user
    loginUser,
    registerUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return context;
};
