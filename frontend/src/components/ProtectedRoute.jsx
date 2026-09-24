import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Verifying session...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login preserving the intended destination
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
