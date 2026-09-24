import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getProductsAPI, deleteProductAPI } from "../services/productService";

const useProducts = () => {
  const [products, setProducts]           = useState([]);
  const [pagination, setPagination]       = useState(null);
  const [isLoading, setIsLoading]         = useState(true);
  const [search, setSearch]               = useState("");
  const [searchInput, setSearchInput]     = useState(""); // Controlled input
  const [page, setPage]                   = useState(1);
  const [deletingId, setDeletingId]       = useState(null); // ID currently being deleted (shows spinner)
  const [pendingDeleteId, setPendingDeleteId] = useState(null); // ID waiting for confirmation

  // ── Fetch products whenever page or search changes ───────────────────────
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getProductsAPI({ page, limit: 9, search });
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ── Search: only trigger when user presses Enter or clicks search ─────────
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1); // Reset to page 1 on new search
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // ── Step 1: User clicks Delete → show confirmation dialog ────────────────
  // Sets pendingDeleteId, which causes ProductsPage to render <ConfirmDialog>
  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
  };

  // ── Step 2: User clicks Cancel in dialog ─────────────────────────────────
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
  };

  // ── Step 3: User clicks Confirm in dialog → perform deletion ─────────────
  const handleConfirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null); // Close the dialog immediately
    setDeletingId(id);        // Show spinner on the card being deleted
    try {
      await deleteProductAPI(id);
      toast.success("Product deleted successfully");
      // Remove from local state immediately for instant UX feedback
      setProducts((prev) => prev.filter((p) => p._id !== id));
      // Refetch to sync pagination totals
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    products,
    pagination,
    isLoading,
    searchInput,
    deletingId,
    pendingDeleteId,
    page,
    setPage,
    setSearchInput,
    handleSearchSubmit,
    handleSearchClear,
    handleDeleteRequest,   // renamed: replaces old handleDelete
    handleCancelDelete,
    handleConfirmDelete,
    refetch: fetchProducts,
  };
};

export default useProducts;
