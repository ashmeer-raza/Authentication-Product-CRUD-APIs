const { body, param } = require("express-validator");

const createProductValidators = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 100 })
    .withMessage("Product name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];

/**
 * Validators for PUT /api/products/:id
 * All fields are optional (partial update), but validated if provided.
 */
const updateProductValidators = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty if provided")
    .isLength({ max: 100 })
    .withMessage("Product name cannot exceed 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number"),

  body("category")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Category cannot exceed 50 characters"),
];

/**
 * Validator for route param :id
 * Used on GET /api/products/:id, PUT /api/products/:id, DELETE /api/products/:id
 */
const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID format"),
];

module.exports = {
  createProductValidators,
  updateProductValidators,
  productIdValidator,
};
