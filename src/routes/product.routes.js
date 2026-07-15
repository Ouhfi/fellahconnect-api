const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const validate = require("../middlewares/validate.middleware");
const productValidator = require("../validators/product.validator");
const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

// Create product (Admin only)
router.post("/", protect, restrictTo("admin"), validate(productValidator.createProduct), productController.createProduct);

// Get all products (Public/Authenticated)
router.get("/", productController.getAllProducts);

// Get specific product
router.get("/:id", productController.getProductById);

// Update product (Admin only)
router.put("/:id", protect, restrictTo("admin"), validate(productValidator.updateProduct), productController.updateProduct);

// Delete product (Admin only)
router.delete("/:id", protect, restrictTo("admin"), productController.deleteProduct);

module.exports = router;
