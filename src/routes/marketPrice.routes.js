const express = require("express");
const router = express.Router();
const marketPriceController = require("../controllers/marketPrice.controller");
const validate = require("../middlewares/validate.middleware");
const marketPriceValidator = require("../validators/marketPrice.validator");

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

module.exports = router;
