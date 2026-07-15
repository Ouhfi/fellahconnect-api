const { MarketPrice, Market, Product } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const { Op } = require("sequelize");

/**
 * Create a new market price entry
 */
async function createMarketPrice(req, res, next) {
  try {
    const { marketId, productId, quality, price, priceDate } = req.body;

    // Check if market exists
    const market = await Market.findByPk(marketId);
    if (!market) {
      return ApiResponse.error(res, "Market not found", 404);
    }

    // Check if product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      return ApiResponse.error(res, "Product not found", 404);
    }

    // Check if a price for this combination already exists (unique constraint check)
    const existingPrice = await MarketPrice.findOne({
      where: { marketId, productId, priceDate, quality }
    });

    if (existingPrice) {
      return ApiResponse.error(res, "Market price record already exists for this date, quality, and market. Please update instead.", 409);
    }

    const marketPrice = await MarketPrice.create({
      marketId,
      productId,
      quality,
      price,
      priceDate
    });

    return ApiResponse.success(res, "Market price created successfully", marketPrice, 201);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all market prices with filtering, pagination, and sorting
 */
async function getAllMarketPrices(req, res, next) {
  try {
    const { marketId, productId, quality, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (marketId) where.marketId = marketId;
    if (productId) where.productId = productId;
    if (quality) where.quality = quality;
    
    if (startDate || endDate) {
      where.priceDate = {};
      if (startDate) where.priceDate[Op.gte] = startDate;
      if (endDate) where.priceDate[Op.lte] = endDate;
    }

    const { count, rows } = await MarketPrice.findAndCountAll({
      where,
      include: [
        { model: Market, as: "market", attributes: ["id", "name", "city", "region"] },
        { model: Product, as: "product", attributes: ["id", "name", "category", "unit"] }
      ],
      order: [["priceDate", "DESC"], ["price", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    return ApiResponse.success(res, "Market prices retrieved successfully", {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      marketPrices: rows
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get price history for a specific product and market (useful for charts)
 */
async function getMarketPriceHistory(req, res, next) {
  try {
    const { marketId, productId } = req.params;
    const { startDate, endDate, quality } = req.query;

    if (!marketId || !productId) {
      return ApiResponse.error(res, "marketId and productId are required", 400);
    }

    const where = { marketId, productId };
    if (quality) where.quality = quality;

    if (startDate || endDate) {
      where.priceDate = {};
      if (startDate) where.priceDate[Op.gte] = startDate;
      if (endDate) where.priceDate[Op.lte] = endDate;
    }

    const history = await MarketPrice.findAll({
      where,
      include: [
        { model: Market, as: "market", attributes: ["name", "city"] },
        { model: Product, as: "product", attributes: ["name", "unit"] }
      ],
      order: [["priceDate", "ASC"]]
    });

    return ApiResponse.success(res, "Market price history retrieved successfully", history);
  } catch (error) {
    next(error);
  }
}

/**
 * Get a specific market price by ID
 */
async function getMarketPriceById(req, res, next) {
  try {
    const { id } = req.params;

    const marketPrice = await MarketPrice.findByPk(id, {
      include: [
        { model: Market, as: "market", attributes: ["id", "name", "city", "region"] },
        { model: Product, as: "product", attributes: ["id", "name", "category", "unit"] }
      ]
    });

    if (!marketPrice) {
      return ApiResponse.error(res, "Market price entry not found", 404);
    }

    return ApiResponse.success(res, "Market price details retrieved", marketPrice);
  } catch (error) {
    next(error);
  }
}

/**
 * Update a market price by ID
 */
async function updateMarketPrice(req, res, next) {
  try {
    const { id } = req.params;
    const { price, quality, priceDate } = req.body;

    const marketPrice = await MarketPrice.findByPk(id);
    if (!marketPrice) {
      return ApiResponse.error(res, "Market price entry not found", 404);
    }

    await marketPrice.update({
      price: price !== undefined ? price : marketPrice.price,
      quality: quality !== undefined ? quality : marketPrice.quality,
      priceDate: priceDate !== undefined ? priceDate : marketPrice.priceDate
    });

    return ApiResponse.success(res, "Market price updated successfully", marketPrice);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a market price by ID
 */
async function deleteMarketPrice(req, res, next) {
  try {
    const { id } = req.params;

    const marketPrice = await MarketPrice.findByPk(id);
    if (!marketPrice) {
      return ApiResponse.error(res, "Market price entry not found", 404);
    }

    await marketPrice.destroy();

    return ApiResponse.success(res, "Market price deleted successfully");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createMarketPrice,
  getAllMarketPrices,
  getMarketPriceHistory,
  getMarketPriceById,
  updateMarketPrice,
  deleteMarketPrice,
};
