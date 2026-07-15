const { Farmer, User, LandPlot, Harvest } = require("../models");
const ApiResponse = require("../utils/apiResponse");

class FarmerController {
  /**
   * Get all farmers with filters
   */
  async getAllFarmers(req, res, next) {
    try {
      const { city, region, verificationStatus } = req.query;

      const where = {};
      if (city) where.city = city;
      if (region) where.region = region;
      if (verificationStatus) where.verificationStatus = verificationStatus;

      const farmers = await Farmer.findAll({
        where,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email", "isActive"]
          }
        ]
      });

      return ApiResponse.success(res, "Farmers retrieved successfully", farmers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific farmer by ID
   */
  async getFarmerById(req, res, next) {
    try {
      const { id } = req.params;

      const farmer = await Farmer.findByPk(id, {
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email"]
          },
          {
            model: LandPlot,
            as: "landPlots"
          },
          {
            model: Harvest,
            as: "harvests"
          }
        ]
      });

      if (!farmer) {
        return ApiResponse.error(res, "Farmer profile not found", 404);
      }

      return ApiResponse.success(res, "Farmer profile retrieved", farmer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update farmer profile (Farmer updates own, Admin updates any)
   */
  async updateFarmerProfile(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone, city, region } = req.body;

      const farmer = await Farmer.findByPk(id);
      if (!farmer) {
        return ApiResponse.error(res, "Farmer profile not found", 404);
      }

      // Check ownership if role is farmer
      if (req.user.role === "farmer" && (!req.user.farmer || req.user.farmer.id !== farmer.id)) {
        return ApiResponse.error(res, "Access denied. You can only update your own profile.", 403);
      }

      await farmer.update({
        firstName: firstName !== undefined ? firstName : farmer.firstName,
        lastName: lastName !== undefined ? lastName : farmer.lastName,
        phone: phone !== undefined ? phone : farmer.phone,
        city: city !== undefined ? city : farmer.city,
        region: region !== undefined ? region : farmer.region
      });

      return ApiResponse.success(res, "Farmer profile updated successfully", farmer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify farmer status (Admin only)
   */
  async verifyFarmer(req, res, next) {
    try {
      const { id } = req.params;
      const { verificationStatus } = req.body;

      const farmer = await Farmer.findByPk(id);
      if (!farmer) {
        return ApiResponse.error(res, "Farmer profile not found", 404);
      }

      await farmer.update({ verificationStatus });

      return ApiResponse.success(res, `Farmer verification status set to ${verificationStatus}`, farmer);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FarmerController();
