const { Market } = require("../models");
const ApiResponse = require("../utils/apiResponse");

class MarketController {
  /**
   * Create a new market (Admin only)
   */
  async createMarket(req, res, next) {
    try {
      const { name, city, region, type, address, isActive } = req.body;

      const market = await Market.create({
        name,
        city,
        region,
        type,
        address,
        isActive
      });

      return ApiResponse.success(res, "Market created successfully", market, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all markets with filters
   */
  async getAllMarkets(req, res, next) {
    try {
      const { city, type } = req.query;

      const where = {};
      if (city) {
        where.city = city;
      }
      if (type) {
        where.type = type;
      }

      const markets = await Market.findAll({ where });

      return ApiResponse.success(res, "Markets retrieved successfully", markets);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific market by ID
   */
  async getMarketById(req, res, next) {
    try {
      const { id } = req.params;

      const market = await Market.findByPk(id);
      if (!market) {
        return ApiResponse.error(res, "Market not found", 404);
      }

      return ApiResponse.success(res, "Market details retrieved", market);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a market (Admin only)
   */
  async updateMarket(req, res, next) {
    try {
      const { id } = req.params;
      const { name, city, region, type, address, isActive } = req.body;

      const market = await Market.findByPk(id);
      if (!market) {
        return ApiResponse.error(res, "Market not found", 404);
      }

      await market.update({
        name: name !== undefined ? name : market.name,
        city: city !== undefined ? city : market.city,
        region: region !== undefined ? region : market.region,
        type: type !== undefined ? type : market.type,
        address: address !== undefined ? address : market.address,
        isActive: isActive !== undefined ? isActive : market.isActive
      });

      return ApiResponse.success(res, "Market updated successfully", market);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a market (Admin only)
   */
  async deleteMarket(req, res, next) {
    try {
      const { id } = req.params;

      const market = await Market.findByPk(id);
      if (!market) {
        return ApiResponse.error(res, "Market not found", 404);
      }

      await market.destroy();

      return ApiResponse.success(res, "Market deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MarketController();
