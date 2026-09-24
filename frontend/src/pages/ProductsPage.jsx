
import { Link } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../store/AuthContext";

const ProductsPage = () => {
  const {
    products, pagination, isLoading, searchInput, deletingId,
    page, setPage, setSearchInput, handleSearchSubmit, handleSearchClear, handleDelete,
  } = useProducts();

  const { isAuthenticated } = useAuth();

  return (
    <div className="products-page">
      {/* ── Page Header ────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Catalog</h1>
          <p className="page-subtitle">
            {pagination ? `${pagination.total} products available` : "Browse our collection"}
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/products/new" id="add-product-btn" className="btn btn-primary">
            + Add Product
          </Link>
        )}
      </div>

      {/* ── Search Bar ─────────────────────────────────────── */}
      <form onSubmit={handleSearchSubmit} className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="product-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products..."
            className="search-input"
          />
          {searchInput && (
            <button type="button" onClick={handleSearchClear} className="search-clear">✕</button>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* ── Loading State ───────────────────────────────────── */}
      {isLoading ? (
        <div className="loading-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ── Empty State ──────────────────────────────────── */
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No products found</h2>
          <p>Try a different search or add the first product.</p>
          {isAuthenticated && (
            <Link to="/products/new" className="btn btn-primary">Add Product</Link>
          )}
        </div>
      ) : (
        /* ── Product Grid ─────────────────────────────────── */
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDelete}
              isDeleting={deletingId === product._id}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ─────────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            id="prev-page"
            onClick={() => setPage((p) => p - 1)}
            disabled={!pagination.hasPrevPage || isLoading}
            className="btn btn-outline"
          >
            ← Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`page-btn ${p === page ? "active" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            id="next-page"
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNextPage || isLoading}
            className="btn btn-outline"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
