import express from "express";
import productController from "../controllers/product.controller.js";
import validate from "../middlewares/validate.middleware.js";
import productValidator from "../validators/product.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = Router();

function Router() {
  return express.Router();
}

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

export default router;
