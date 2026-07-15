const { Product } = require("../models");
const ApiResponse = require("../utils/apiResponse");
const { Op } = require("sequelize");

class ProductController {
  /**
   * Create a new product (Admin only)
   */
  static async createProduct(req, res, next) {
    try {
      const { name, category, unit, seasonStart, seasonEnd, description } = req.body;

      const existingProduct = await Product.findOne({ where: { name } });
      if (existingProduct) {
        return ApiResponse.error(res, "Product with this name already exists", 400);
      }

      const product = await Product.create({
        name,
        category,
        unit,
        seasonStart,
        seasonEnd,
        description
      });

      return ApiResponse.success(res, "Product created successfully", product, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all products with search and category filters
   */
  static async getAllProducts(req, res, next) {
    try {
      const { search, category } = req.query;

      const where = {};
      if (category) {
        where.category = category;
      }
      if (search) {
        where.name = { [Op.iLike]: `%${search}%` };
      }

      const products = await Product.findAll({ where });

      return ApiResponse.success(res, "Products retrieved successfully", products);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific product by ID
   */
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      return ApiResponse.success(res, "Product details retrieved", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update product (Admin only)
   */
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, category, unit, seasonStart, seasonEnd, description } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      if (name && name !== product.name) {
        const existingProduct = await Product.findOne({ where: { name } });
        if (existingProduct) {
          return ApiResponse.error(res, "Another product with this name already exists", 400);
        }
      }

      await product.update({
        name: name !== undefined ? name : product.name,
        category: category !== undefined ? category : product.category,
        unit: unit !== undefined ? unit : product.unit,
        seasonStart: seasonStart !== undefined ? seasonStart : product.seasonStart,
        seasonEnd: seasonEnd !== undefined ? seasonEnd : product.seasonEnd,
        description: description !== undefined ? description : product.description
      });

      return ApiResponse.success(res, "Product updated successfully", product);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete product (Admin only)
   */
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await Product.findByPk(id);
      if (!product) {
        return ApiResponse.error(res, "Product not found", 404);
      }

      await product.destroy();

      return ApiResponse.success(res, "Product deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
