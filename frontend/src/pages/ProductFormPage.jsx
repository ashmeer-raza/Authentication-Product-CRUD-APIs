
import { useParams, Link } from "react-router-dom";
import useProductForm from "../hooks/useProductForm";
import FormField from "../components/FormField";

const CATEGORIES = ["General", "Electronics", "Clothing", "Food", "Books", "Sports", "Home", "Beauty", "Toys"];

const ProductFormPage = () => {
  const { id } = useParams(); // undefined for create, set for edit
  const { formData, errors, isLoading, isFetching, isEditMode, handleChange, handleSubmit } =
    useProductForm(id);

  if (isFetching) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-page-header">
        <Link to="/products" className="back-link">← Back to Products</Link>
        <h1 className="page-title">
          {isEditMode ? "✏️ Edit Product" : "➕ Add New Product"}
        </h1>
        <p className="page-subtitle">
          {isEditMode ? "Update the product details below" : "Fill in the details to list a new product"}
        </p>
      </div>

      <div className="product-form-card">
        {errors.general && (
          <div className="alert alert-error">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="product-form" noValidate>
          <div className="form-grid">
            <FormField
              label="Product Name *"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Headphones"
              error={errors.name}
              required
            />

            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <FormField
              label="Price (₹) *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              error={errors.price}
              min="0"
              step="0.01"
              required
            />

            <FormField
              label="Stock Quantity *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              error={errors.stock}
              min="0"
              step="1"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your product in detail..."
              className={`form-input form-textarea ${errors.description ? "input-error" : ""}`}
              rows={4}
              maxLength={1000}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
            <span className="char-count">{formData.description.length}/1000</span>
          </div>

          <div className="form-actions">
            <Link to="/products" className="btn btn-ghost">Cancel</Link>
            <button
              type="submit"
              id="product-form-submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <><span className="btn-spinner" /> {isEditMode ? "Updating..." : "Creating..."}</>
              ) : (
                isEditMode ? "Update Product" : "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormPage;
