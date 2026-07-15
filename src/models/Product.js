const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.Harvest, {
        foreignKey: "productId",
        as: "harvests",
      });

      Product.hasMany(models.MarketPrice, {
        foreignKey: "productId",
        as: "marketPrices",
      });
    }
  }

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      category: {
        type: DataTypes.ENUM(
          "Vegetable",
          "Fruit",
          "Cereal",
          "Legume",
          "Other"
        ),
        allowNull: false,
      },

      unit: {
        type: DataTypes.ENUM(
          "kg",
          "ton",
          "box",
          "piece"
        ),
        allowNull: false,
        defaultValue: "kg",
      },

      seasonStart: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 12,
        },
      },

      seasonEnd: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 12,
        },
      },

      description: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,

      validate: {
        seasonValidation() {
          if (this.seasonStart > this.seasonEnd) {
            throw new Error(
              "seasonStart must be less than or equal to seasonEnd"
            );
          }
        },
      },
    }
  );

  return Product;
};