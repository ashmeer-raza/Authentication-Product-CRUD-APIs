const Product = require("../models/Product");
const { sendSuccess, sendError } = require("../utils/response");

// POST /api/products
// Create a new product — Authenticated
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      createdBy: req.user._id, // From authenticate middleware
    });

    return sendSuccess(res, 201, "Product created successfully", { product });
  } catch (error) {
    console.error("Create product error:", error);
    return sendError(res, 500, "Could not create product");
  }
};

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const search = req.query.search
      ? { name: { $regex: req.query.search, $options: "i" } }
      : {};

    const [products, total] = await Promise.all([
      Product.find(search)
        .populate("createdBy", "name email") // Show creator's name/email (not password)
        .sort({ createdAt: -1 })             // Newest first
        .skip(skip)
        .limit(limit),
      Product.countDocuments(search),
    ]);

    return sendSuccess(res, 200, "Products fetched", {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return sendError(res, 500, "Could not fetch products");
  }
};

// GET /api/products/:id
// Get a single product by its MongoDB _id — Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    return sendSuccess(res, 200, "Product fetched", { product });
  } catch (error) {
    console.error("Get product by ID error:", error);
    return sendError(res, 500, "Could not fetch product");
  }
};

// PUT /api/products/:id
// Update a product — Authenticated
const updateProduct = async (req, res) => {
  try {
    // First confirm the product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    // Whitelist only the fields we allow to be updated
    const { name, description, price, stock, category } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = price;
    if (stock !== undefined) updates.stock = stock;
    if (category !== undefined) updates.category = category;

    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 200, "Product updated successfully", {
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    return sendError(res, 500, "Could not update product");
  }
};

// DELETE /api/products/:id
// Delete a product — Authenticated
const deleteProduct = async (req, res) => {
  try {
    // First confirm the product exists before attempting deletion
    const product = await Product.findById(req.params.id);
    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    await Product.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 200, "Product deleted successfully");
  } catch (error) {
    console.error("Delete product error:", error);
    return sendError(res, 500, "Could not delete product");
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
