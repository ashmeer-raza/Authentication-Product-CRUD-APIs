import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createProductAPI, updateProductAPI, getProductByIdAPI } from "../services/productService";

const INITIAL_FORM = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const useProductForm = (productId = null) => {
  const navigate = useNavigate();
  const isEditMode = !!productId;

  const [formData, setFormData]     = useState(INITIAL_FORM);
  const [errors, setErrors]         = useState({});
  const [isLoading, setIsLoading]   = useState(false);
  const [isFetching, setIsFetching] = useState(isEditMode); // True while loading existing data

  // ── If editing: fetch the existing product to prefill the form ────────────
  useEffect(() => {
    if (!isEditMode) return;
    const loadProduct = async () => {
      try {
        const res = await getProductByIdAPI(productId);
        const { name, description, price, stock, category } = res.data.product;
        setFormData({ name, description: description || "", price, stock, category: category || "" });
      } catch {
        toast.error("Could not load product data");
        navigate("/products");
      } finally {
        setIsFetching(false);
      }
    };
    loadProduct();
  }, [productId, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.price && formData.price !== 0) newErrors.price = "Price is required";
    else if (isNaN(formData.price) || Number(formData.price) < 0) newErrors.price = "Price must be a non-negative number";
    if (!formData.stock && formData.stock !== 0) newErrors.stock = "Stock is required";
    else if (!Number.isInteger(Number(formData.stock)) || Number(formData.stock) < 0) newErrors.stock = "Stock must be a non-negative whole number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Convert price and stock to numbers before sending
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
    };

    try {
      if (isEditMode) {
        await updateProductAPI(productId, payload);
        toast.success("Product updated successfully!");
      } else {
        await createProductAPI(payload);
        toast.success("Product created successfully!");
      }
      navigate("/products");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
      } else {
        const msg = err.response?.data?.message || "Operation failed";
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, errors, isLoading, isFetching, isEditMode, handleChange, handleSubmit };
};

export default useProductForm;
