const express = require("express");
const router = express.Router();
const saleOfferController = require("../controllers/saleOffer.controller");
const validate = require("../middlewares/validate.middleware");
const saleOfferValidator = require("../validators/saleOffer.validator");
const { protect } = require("../middlewares/auth.middleware");

// Create sale offer
router.post("/", protect, validate(saleOfferValidator.createSaleOffer), saleOfferController.createSaleOffer);

// Get all sale offers (For farmer or all for admin)
router.get("/", protect, saleOfferController.getAllSaleOffers);

// Get specific sale offer
router.get("/:id", protect, saleOfferController.getSaleOfferById);

// Update sale offer
router.put("/:id", protect, validate(saleOfferValidator.updateSaleOffer), saleOfferController.updateSaleOffer);

// Delete sale offer
router.delete("/:id", protect, saleOfferController.deleteSaleOffer);

module.exports = router;
