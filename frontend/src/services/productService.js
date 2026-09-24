import axiosInstance from "./axiosInstance";

/**
 * Fetch all products with optional pagination and search.
 * @param {{ page?, limit?, search? }} params
 * @returns {Promise<{products, pagination}>}
 */
export const getProductsAPI = async (params = {}) => {
  const { data } = await axiosInstance.get("/products", { params });
  return data;
};

/**
 * Fetch a single product by its ID.
 * @param {string} id - MongoDB ObjectId
 * @returns {Promise<{product}>}
 */
export const getProductByIdAPI = async (id) => {
  const { data } = await axiosInstance.get(`/products/${id}`);
  return data;
};

/**
 * Create a new product (Authenticated).
 * @param {{ name, description, price, stock, category }} productData
 * @returns {Promise<{product}>} Created product
 */
export const createProductAPI = async (productData) => {
  const { data } = await axiosInstance.post("/products", productData);
  return data;
};

/**
 * Update an existing product (Authenticated).
 * @param {string} id - Product ID to update
 * @param {object} updates - Partial product fields to update
 * @returns {Promise<{product}>} Updated product
 */
export const updateProductAPI = async (id, updates) => {
  const { data } = await axiosInstance.put(`/products/${id}`, updates);
  return data;
};

/**
 * Delete a product by ID (Authenticated).
 * @param {string} id - Product ID to delete
 * @returns {Promise<void>}
 */
export const deleteProductAPI = async (id) => {
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};
