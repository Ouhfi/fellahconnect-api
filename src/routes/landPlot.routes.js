import express from "express";
import landPlotController from "../controllers/landPlot.controller.js";
import validate from "../middlewares/validate.middleware.js";
import landPlotValidator from "../validators/landPlot.validator.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

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

export default router;
