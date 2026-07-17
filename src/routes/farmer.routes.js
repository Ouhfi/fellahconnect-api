import express from "express";
import farmerController from "../controllers/farmer.controller.js";
import validate from "../middlewares/validate.middleware.js";
import farmerValidator from "../validators/farmer.validator.js";
import { protect } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get all farmer profiles
router.get("/", protect, farmerController.getAllFarmers);

// Get specific farmer profile details
router.get("/:id", protect, farmerController.getFarmerById);

// Update farmer profile
router.put("/:id", protect, validate(farmerValidator.updateFarmer), farmerController.updateFarmerProfile);

// Verify farmer (Admin only)
router.patch("/:id/verify", protect, restrictTo("admin"), validate(farmerValidator.verifyFarmer), farmerController.verifyFarmer);

export default router;
