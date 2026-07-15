const express = require("express");
const router = express.Router();
const harvestController = require("../controllers/harvest.controller");
const validate = require("../middlewares/validate.middleware");
const harvestValidator = require("../validators/harvest.validator");
const { protect } = require("../middlewares/auth.middleware");

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

module.exports = router;
