const express = require("express");
const router = express.Router();

// Controllers
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Validators
const {
  createProductValidators,
  updateProductValidators,
  productIdValidator,
} = require("../validators/productValidators");

// Middleware
const authenticate = require("../middleware/authenticate");
const handleValidationErrors = require("../middleware/validationHandler");

// ── Public Routes ──────────────────────────────────────────────────────────
router.get("/", getProducts);
router.get("/:id", productIdValidator, handleValidationErrors, getProductById);

// ── Protected Routes ───────────────────────────────────────────────────────
router.post(
  "/",
  authenticate,
  createProductValidators,
  handleValidationErrors,
  createProduct
);

router.put(
  "/:id",
  authenticate,
  productIdValidator,
  updateProductValidators,
  handleValidationErrors,
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  productIdValidator,
  handleValidationErrors,
  deleteProduct
);

module.exports = router;
