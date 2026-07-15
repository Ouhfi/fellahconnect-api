const { LandPlot, Farmer } = require("../models");
const ApiResponse = require("../utils/apiResponse");

/**
 * Create a new land plot
 */
async function createLandPlot(req, res, next) {
  try {
    const { name, area, location, soilType, isActive } = req.body;
    let { farmerId } = req.body;

    // If user is a farmer, use their profile ID
    if (req.user.role === "farmer") {
      if (!req.user.farmer) {
        return ApiResponse.error(res, "Farmer profile not found for this user", 400);
      }
      farmerId = req.user.farmer.id;
    } else if (req.user.role === "admin" && !farmerId) {
      return ApiResponse.error(res, "farmerId is required for admins to assign a plot", 400);
    }

    // Verify farmer profile exists
    const farmer = await Farmer.findByPk(farmerId);
    if (!farmer) {
      return ApiResponse.error(res, "Farmer profile not found", 404);
    }

    const landPlot = await LandPlot.create({
      farmerId,
      name,
      area,
      location,
      soilType,
      isActive
    });

    return ApiResponse.success(res, "Land plot created successfully", landPlot, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all land plots (Farmers see only their own, Admins see all)
 */
async function getAllLandPlots(req, res, next) {
  try {
    const where = {};

    // Filter by ownership if current user is a farmer
    if (req.user.role === "farmer") {
      if (!req.user.farmer) {
        return ApiResponse.error(res, "Farmer profile not found for this user", 400);
      }
      where.farmerId = req.user.farmer.id;
    } else {
      // Admin query filter optionally
      const { farmerId } = req.query;
      if (farmerId) {
        where.farmerId = farmerId;
      }
    }

    const plots = await LandPlot.findAll({
      where,
      include: [
        {
          model: Farmer,
          as: "farmer",
          attributes: ["id", "firstName", "lastName", "phone", "city"]
        }
      ]
    });

    return ApiResponse.success(res, "Land plots retrieved successfully", plots);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific land plot by ID
 */
async function getLandPlotById(req, res, next) {
  try {
    const { id } = req.params;

    const landPlot = await LandPlot.findByPk(id, {
      include: [
        {
          model: Farmer,
          as: "farmer",
          attributes: ["id", "firstName", "lastName"]
        }
      ]
    });

    if (!landPlot) {
      return ApiResponse.error(res, "Land plot not found", 404);
    }

    // Check ownership if user is a farmer
    if (req.user.role === "farmer" && landPlot.farmerId !== req.user.farmer.id) {
      return ApiResponse.error(res, "Access denied. You do not own this land plot.", 403);
    }

    return ApiResponse.success(res, "Land plot details retrieved", landPlot);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a land plot
 */
async function updateLandPlot(req, res, next) {
  try {
    const { id } = req.params;
    const { name, area, location, soilType, isActive } = req.body;

    const landPlot = await LandPlot.findByPk(id);
    if (!landPlot) {
      return ApiResponse.error(res, "Land plot not found", 404);
    }

    // Check ownership if user is a farmer
    if (req.user.role === "farmer" && landPlot.farmerId !== req.user.farmer.id) {
      return ApiResponse.error(res, "Access denied. You do not own this land plot.", 403);
    }

    await landPlot.update({
      name: name !== undefined ? name : landPlot.name,
      area: area !== undefined ? area : landPlot.area,
      location: location !== undefined ? location : landPlot.location,
      soilType: soilType !== undefined ? soilType : landPlot.soilType,
      isActive: isActive !== undefined ? isActive : landPlot.isActive
    });

    return ApiResponse.success(res, "Land plot updated successfully", landPlot);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a land plot
 */
async function deleteLandPlot(req, res, next) {
  try {
    const { id } = req.params;

    const landPlot = await LandPlot.findByPk(id);
    if (!landPlot) {
      return ApiResponse.error(res, "Land plot not found", 404);
    }

    // Check ownership if user is a farmer
    if (req.user.role === "farmer" && landPlot.farmerId !== req.user.farmer.id) {
      return ApiResponse.error(res, "Access denied. You do not own this land plot.", 403);
    }

    await landPlot.destroy();

    return ApiResponse.success(res, "Land plot deleted successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLandPlot,
  getAllLandPlots,
  getLandPlotById,
  updateLandPlot,
  deleteLandPlot,
};
