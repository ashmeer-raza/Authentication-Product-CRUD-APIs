
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProductByIdAPI, deleteProductAPI } from "../services/productService";
import { useAuth } from "../store/AuthContext";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [product, setProduct]   = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdAPI(id);
        setProduct(res.data.product);
      } catch (err) {
        toast.error("Product not found");
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this product permanently?")) return;
    setIsDeleting(true);
    try {
      await deleteProductAPI(id);
      toast.success("Product deleted");
      navigate("/products");
    } catch {
      toast.error("Could not delete product");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) return null;

  const stockClass = product.stock === 0 ? "out-of-stock" : product.stock < 10 ? "low-stock" : "in-stock";

  return (
    <div className="detail-page">
      <Link to="/products" className="back-link">← Back to Products</Link>

      <div className="detail-card">
        <div className="detail-header">
          <div className="detail-badge">{product.category || "General"}</div>
          <h1 className="detail-title">{product.name}</h1>
          <p className="detail-by">
            Listed by <strong>{product.createdBy?.name || "Unknown"}</strong> ·{" "}
            {new Date(product.createdAt).toLocaleDateString("en-IN", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>

        <div className="detail-body">
          <div className="detail-price-row">
            <div className="detail-price">₹{Number(product.price).toLocaleString("en-IN")}</div>
            <div className={`stock-badge ${stockClass}`}>
              {product.stock === 0 ? "Out of Stock" : `${product.stock} in stock`}
            </div>
          </div>

          {product.description && (
            <div className="detail-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{product.category || "General"}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Product ID</span>
              <span className="meta-value mono">{product._id}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Last Updated</span>
              <span className="meta-value">
                {new Date(product.updatedAt).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <div className="detail-actions">
            <Link to={`/products/${product._id}/edit`} className="btn btn-primary">
              ✏️ Edit Product
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn btn-danger"
              id="delete-product-btn"
            >
              {isDeleting ? "Deleting..." : "🗑️ Delete Product"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
