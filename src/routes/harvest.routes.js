import express from "express";
import harvestController from "../controllers/harvest.controller.js";
import validate from "../middlewares/validate.middleware.js";
import harvestValidator from "../validators/harvest.validator.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create harvest entry
router.post("/", protect, validate(harvestValidator.createHarvest), harvestController.createHarvest);

// Get all harvests for the authenticated farmer or all for admin
router.get("/", protect, harvestController.getAllHarvests);

// Get specific harvest details
router.get("/:id", protect, harvestController.getHarvestById);

// Update harvest details
router.put("/:id", protect, validate(harvestValidator.updateHarvest), harvestController.updateHarvest);

// Delete harvest
router.delete("/:id", protect, harvestController.deleteHarvest);

export default router;
