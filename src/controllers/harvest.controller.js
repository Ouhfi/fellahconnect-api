const { Harvest, LandPlot, Product, Farmer } = require("../models");
const ApiResponse = require("../utils/apiResponse");

class HarvestController {
  /**
   * Create a new harvest
   */
  async createHarvest(req, res, next) {
    try {
      const { productId, landPlotId, quantity, unit, harvestDate, status } = req.body;

      // Verify land plot exists and belongs to the farmer
      const landPlot = await LandPlot.findByPk(landPlotId);
      if (!landPlot) {
        return ApiResponse.error(res, "Land plot not found", 404);
      }

      if (req.user.role === "farmer" && landPlot.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this land plot.", 403);
      }

      // Verify product exists
      const product = await Product.findByPk(productId);
      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      const harvest = await Harvest.create({
        farmerId: landPlot.farmerId,
        productId,
        landPlotId,
        quantity,
        unit,
        harvestDate,
        status
      });

      return ApiResponse.success(res, "Harvest recorded successfully", harvest, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all harvests (Farmers see only their own, Admins see all)
   */
  async getAllHarvests(req, res, next) {
    try {
      const where = {};

      if (req.user.role === "farmer") {
        if (!req.user.farmer) {
          return ApiResponse.error(res, "Farmer profile not found for this user", 400);
        }
        where.farmerId = req.user.farmer.id;
      } else {
        const { farmerId } = req.query;
        if (farmerId) {
          where.farmerId = farmerId;
        }
      }

      const harvests = await Harvest.findAll({
        where,
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "category", "unit"]
          },
          {
            model: LandPlot,
            as: "landPlot",
            attributes: ["id", "name", "area", "location"]
          },
          {
            model: Farmer,
            as: "farmer",
            attributes: ["id", "firstName", "lastName"]
          }
        ]
      });

      return ApiResponse.success(res, "Harvests retrieved successfully", harvests);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific harvest by ID
   */
  async getHarvestById(req, res, next) {
    try {
      const { id } = req.params;

      const harvest = await Harvest.findByPk(id, {
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "category", "unit"]
          },
          {
            model: LandPlot,
            as: "landPlot",
            attributes: ["id", "name", "area", "location"]
          }
        ]
      });

      if (!harvest) {
        return ApiResponse.error(res, "Harvest record not found", 404);
      }

      if (req.user.role === "farmer" && harvest.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this harvest record.", 403);
      }

      return ApiResponse.success(res, "Harvest details retrieved", harvest);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a harvest record
   */
  async updateHarvest(req, res, next) {
    try {
      const { id } = req.params;
      const { productId, landPlotId, quantity, unit, harvestDate, status } = req.body;

      const harvest = await Harvest.findByPk(id);
      if (!harvest) {
        return ApiResponse.error(res, "Harvest record not found", 404);
      }

      if (req.user.role === "farmer" && harvest.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this harvest record.", 403);
      }

      if (landPlotId && landPlotId !== harvest.landPlotId) {
        const landPlot = await LandPlot.findByPk(landPlotId);
        if (!landPlot) {
          return ApiResponse.error(res, "Land plot not found", 404);
        }
        if (req.user.role === "farmer" && landPlot.farmerId !== req.user.farmer.id) {
          return ApiResponse.error(res, "Access denied. You do not own this land plot.", 403);
        }
        harvest.landPlotId = landPlotId;
        harvest.farmerId = landPlot.farmerId;
      }

      if (productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
          return ApiResponse.error(res, "Product not found", 404);
        }
        harvest.productId = productId;
      }

      await harvest.update({
        quantity: quantity !== undefined ? quantity : harvest.quantity,
        unit: unit !== undefined ? unit : harvest.unit,
        harvestDate: harvestDate !== undefined ? harvestDate : harvest.harvestDate,
        status: status !== undefined ? status : harvest.status
      });

      return ApiResponse.success(res, "Harvest updated successfully", harvest);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a harvest record
   */
  async deleteHarvest(req, res, next) {
    try {
      const { id } = req.params;

      const harvest = await Harvest.findByPk(id);
      if (!harvest) {
        return ApiResponse.error(res, "Harvest record not found", 404);
      }

      if (req.user.role === "farmer" && harvest.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this harvest record.", 403);
      }

      await harvest.destroy();

      return ApiResponse.success(res, "Harvest record deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new HarvestController();
