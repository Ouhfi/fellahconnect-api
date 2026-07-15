const express = require("express");
const router = express.Router();
const landPlotController = require("../controllers/landPlot.controller");
const validate = require("../middlewares/validate.middleware");
const landPlotValidator = require("../validators/landPlot.validator");
const { protect } = require("../middlewares/auth.middleware");

// Create land plot
router.post("/", protect, validate(landPlotValidator.createLandPlot), landPlotController.createLandPlot);

// Get all land plots for the authenticated farmer or all for admin
router.get("/", protect, landPlotController.getAllLandPlots);

// Get specific land plot details
router.get("/:id", protect, landPlotController.getLandPlotById);

// Update land plot details
router.put("/:id", protect, validate(landPlotValidator.updateLandPlot), landPlotController.updateLandPlot);

// Delete land plot
router.delete("/:id", protect, landPlotController.deleteLandPlot);

module.exports = router;
