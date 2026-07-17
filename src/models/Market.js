import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Market extends Model {
    static associate(models) {
      Market.hasMany(models.MarketPrice, {
        foreignKey: "marketId",
        as: "marketPrices",
      });

      Market.hasMany(models.SaleOffer, {
        foreignKey: "marketId",
        as: "saleOffers",
      });
    }
  }

  Market.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM(
          "Wholesale",
          "Retail",
          "Local"
        ),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Market",
      tableName: "markets",
      timestamps: true,
    }
  );

  return Market;
};