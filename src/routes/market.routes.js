const express = require("express");
const router = express.Router();
const marketController = require("../controllers/market.controller");
const validate = require("../middlewares/validate.middleware");
const marketValidator = require("../validators/market.validator");
const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

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

module.exports = router;
