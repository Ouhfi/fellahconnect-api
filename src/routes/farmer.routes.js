const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer.controller");
const validate = require("../middlewares/validate.middleware");
const farmerValidator = require("../validators/farmer.validator");
const { protect } = require("../middlewares/auth.middleware");
const { restrictTo } = require("../middlewares/role.middleware");

// Get all farmer profiles
router.get("/", protect, farmerController.getAllFarmers);

// Get specific farmer profile details
router.get("/:id", protect, farmerController.getFarmerById);

// Update farmer profile
router.put("/:id", protect, validate(farmerValidator.updateFarmer), farmerController.updateFarmerProfile);

// Verify farmer (Admin only)
router.patch("/:id/verify", protect, restrictTo("admin"), validate(farmerValidator.verifyFarmer), farmerController.verifyFarmer);

module.exports = router;
