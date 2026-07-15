const { SaleOffer, Harvest, Market, Farmer, Product } = require("../models");
const ApiResponse = require("../utils/apiResponse");

class SaleOfferController {
  /**
   * Create a new sale offer
   */
  async createSaleOffer(req, res, next) {
    try {
      const { harvestId, marketId, quantity, unitPrice, offerDate, status } = req.body;

      // Verify harvest exists and belongs to the farmer
      const harvest = await Harvest.findByPk(harvestId);
      if (!harvest) {
        return ApiResponse.error(res, "Harvest not found", 404);
      }

      if (req.user.role === "farmer" && harvest.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this harvest.", 403);
      }

      // Verify market exists
      const market = await Market.findByPk(marketId);
      if (!market) {
        return ApiResponse.error(res, "Market not found", 404);
      }

      // Check quantity doesn't exceed harvest quantity
      if (quantity > harvest.quantity) {
        return ApiResponse.error(res, `Quantity exceeds available harvest quantity (${harvest.quantity} ${harvest.unit || 'kg'})`, 400);
      }

      // Calculate totalPrice
      const totalPrice = quantity * unitPrice;

      const saleOffer = await SaleOffer.create({
        farmerId: harvest.farmerId,
        harvestId,
        marketId,
        quantity,
        unitPrice,
        totalPrice,
        offerDate,
        status
      });

      return ApiResponse.success(res, "Sale offer created successfully", saleOffer, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all sale offers (Farmers see their own, Admins see all, others can filter)
   */
  async getAllSaleOffers(req, res, next) {
    try {
      const where = {};

      if (req.user.role === "farmer") {
        if (!req.user.farmer) {
          return ApiResponse.error(res, "Farmer profile not found for this user", 400);
        }
        where.farmerId = req.user.farmer.id;
      } else {
        const { farmerId, marketId, status } = req.query;
        if (farmerId) where.farmerId = farmerId;
        if (marketId) where.marketId = marketId;
        if (status) where.status = status;
      }

      const offers = await SaleOffer.findAll({
        where,
        include: [
          {
            model: Farmer,
            as: "farmer",
            attributes: ["id", "firstName", "lastName", "phone"]
          },
          {
            model: Market,
            as: "market",
            attributes: ["id", "name", "city"]
          },
          {
            model: Harvest,
            as: "harvest",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name", "category"]
              }
            ]
          }
        ]
      });

      return ApiResponse.success(res, "Sale offers retrieved successfully", offers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific sale offer by ID
   */
  async getSaleOfferById(req, res, next) {
    try {
      const { id } = req.params;

      const saleOffer = await SaleOffer.findByPk(id, {
        include: [
          {
            model: Farmer,
            as: "farmer",
            attributes: ["id", "firstName", "lastName", "phone"]
          },
          {
            model: Market,
            as: "market",
            attributes: ["id", "name", "city"]
          },
          {
            model: Harvest,
            as: "harvest",
            include: [
              {
                model: Product,
                as: "product",
                attributes: ["id", "name"]
              }
            ]
          }
        ]
      });

      if (!saleOffer) {
        return ApiResponse.error(res, "Sale offer not found", 404);
      }

      if (req.user.role === "farmer" && saleOffer.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this sale offer.", 403);
      }

      return ApiResponse.success(res, "Sale offer details retrieved", saleOffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a sale offer
   */
  async updateSaleOffer(req, res, next) {
    try {
      const { id } = req.params;
      const { harvestId, marketId, quantity, unitPrice, offerDate, status } = req.body;

      const saleOffer = await SaleOffer.findByPk(id);
      if (!saleOffer) {
        return ApiResponse.error(res, "Sale offer not found", 404);
      }

      if (req.user.role === "farmer" && saleOffer.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this sale offer.", 403);
      }

      if (harvestId && harvestId !== saleOffer.harvestId) {
        const harvest = await Harvest.findByPk(harvestId);
        if (!harvest) {
          return ApiResponse.error(res, "Harvest not found", 404);
        }
        if (req.user.role === "farmer" && harvest.farmerId !== req.user.farmer.id) {
          return ApiResponse.error(res, "Access denied. You do not own this harvest.", 403);
        }
        saleOffer.harvestId = harvestId;
        saleOffer.farmerId = harvest.farmerId;
      }

      if (marketId) {
        const market = await Market.findByPk(marketId);
        if (!market) {
          return ApiResponse.error(res, "Market not found", 404);
        }
        saleOffer.marketId = marketId;
      }

      const newQty = quantity !== undefined ? quantity : saleOffer.quantity;
      const newPrice = unitPrice !== undefined ? unitPrice : saleOffer.unitPrice;
      const totalPrice = newQty * newPrice;

      await saleOffer.update({
        quantity: newQty,
        unitPrice: newPrice,
        totalPrice,
        offerDate: offerDate !== undefined ? offerDate : saleOffer.offerDate,
        status: status !== undefined ? status : saleOffer.status
      });

      return ApiResponse.success(res, "Sale offer updated successfully", saleOffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a sale offer
   */
  async deleteSaleOffer(req, res, next) {
    try {
      const { id } = req.params;

      const saleOffer = await SaleOffer.findByPk(id);
      if (!saleOffer) {
        return ApiResponse.error(res, "Sale offer not found", 404);
      }

      if (req.user.role === "farmer" && saleOffer.farmerId !== req.user.farmer.id) {
        return ApiResponse.error(res, "Access denied. You do not own this sale offer.", 403);
      }

      await saleOffer.destroy();

      return ApiResponse.success(res, "Sale offer deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SaleOfferController();
