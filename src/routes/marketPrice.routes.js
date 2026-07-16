import express from "express";
import marketPriceController from "../controllers/marketPrice.controller.js";
import validate from "../middlewares/validate.middleware.js";
import marketPriceValidator from "../validators/marketPrice.validator.js";

const router = express.Router();

// Create a new market price entry
router.post("/", validate(marketPriceValidator.createMarketPrice), marketPriceController.createMarketPrice);

// Get all market prices with query filters and pagination
router.get("/", marketPriceController.getAllMarketPrices);

// Get price history for charts
router.get("/history/:marketId/:productId", marketPriceController.getMarketPriceHistory);

// Get specific market price detail by ID
router.get("/:id", marketPriceController.getMarketPriceById);

// Update a market price entry
router.put("/:id", validate(marketPriceValidator.updateMarketPrice), marketPriceController.updateMarketPrice);

// Delete a market price entry
router.delete("/:id", marketPriceController.deleteMarketPrice);

export default router;
