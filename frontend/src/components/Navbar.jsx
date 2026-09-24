import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logoutUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logoutUser();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          <span className="brand-icon"></span>
          <span className="brand-name">ShopStack</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/products" className={isActive("/products")}>Products</Link>
        {isAuthenticated && (
          <Link to="/products/new" className={isActive("/products/new")}>+ Add Product</Link>
        )}
      </div>

      <div className="navbar-actions">
        {isAuthenticated ? (
          <>
            <span className="user-greeting">
              👋 <strong>{user?.name?.split(" ")[0]}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
