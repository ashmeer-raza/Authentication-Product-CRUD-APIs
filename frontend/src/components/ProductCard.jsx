import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const CATEGORY_COLORS = {
  Electronics: "#6366f1",
  Clothing: "#ec4899",
  Food: "#f59e0b",
  Books: "#10b981",
  Sports: "#3b82f6",
  General: "#8b5cf6",
};

const ProductCard = ({ product, onDelete, isDeleting }) => {
  const { isAuthenticated } = useAuth();
  const color = CATEGORY_COLORS[product.category] || "#8b5cf6";

  return (
    <div className="product-card" style={{ "--accent": color }}>
      {/* Category badge */}
      <div className="card-badge" style={{ background: color }}>
        {product.category || "General"}
      </div>

      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">
          {product.description
            ? product.description.substring(0, 80) + (product.description.length > 80 ? "..." : "")
            : "No description provided."}
        </p>

        <div className="card-meta">
          <div className="card-price">
            <span className="price-label">Price</span>
            <span className="price-value">₹{Number(product.price).toLocaleString("en-IN")}</span>
          </div>
          <div className={`stock-badge ${product.stock === 0 ? "out-of-stock" : product.stock < 10 ? "low-stock" : "in-stock"}`}>
            {product.stock === 0
              ? "Out of Stock"
              : product.stock < 10
              ? `${product.stock} left`
              : `${product.stock} in stock`}
          </div>
        </div>

        <div className="card-footer">
          <Link to={`/products/${product._id}`} className="btn btn-ghost btn-sm">
            View
          </Link>
          {isAuthenticated && (
            <>
              <Link to={`/products/${product._id}/edit`} className="btn btn-outline btn-sm">
                Edit
              </Link>
              <button
                onClick={() => onDelete(product._id)}
                disabled={isDeleting}
                className="btn btn-danger btn-sm"
              >
                {isDeleting ? "..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
