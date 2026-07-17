import express from "express";
import saleOfferController from "../controllers/saleOffer.controller.js";
import validate from "../middlewares/validate.middleware.js";
import saleOfferValidator from "../validators/saleOffer.validator.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

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

export default router;
