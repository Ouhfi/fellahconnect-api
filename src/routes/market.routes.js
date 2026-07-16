import express from "express";
import marketController from "../controllers/market.controller.js";
import validate from "../middlewares/validate.middleware.js";
import marketValidator from "../validators/market.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = express.Router();

// Create a new market (Admin only)
router.post("/", protect, restrictTo("admin"), validate(marketValidator.createMarket), marketController.createMarket);

// Get all markets
router.get("/", marketController.getAllMarkets);

// Get specific market details
router.get("/:id", marketController.getMarketById);

// Update a market (Admin only)
router.put("/:id", protect, restrictTo("admin"), validate(marketValidator.updateMarket), marketController.updateMarket);

// Delete a market (Admin only)
router.delete("/:id", protect, restrictTo("admin"), marketController.deleteMarket);

export default router;
