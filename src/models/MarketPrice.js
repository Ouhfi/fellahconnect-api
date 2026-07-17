import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class MarketPrice extends Model {
    static associate(models) {
      MarketPrice.belongsTo(models.Market, {
        foreignKey: "marketId",
        as: "market",
      });

      MarketPrice.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });
    }
  }

  MarketPrice.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      marketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quality: {
        type: DataTypes.ENUM("A", "B", "C"),
        allowNull: false,
        defaultValue: "A",
      },

      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
          min: 0,
        },
      },

      priceDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MarketPrice",
      tableName: "market_prices",
      timestamps: true,

      indexes: [
        {
          unique: true,
          fields: ["marketId", "productId", "priceDate", "quality"],
        },
        {
          fields: ["priceDate"],
        },
      ],

      hooks: {
        afterCreate: async () => {
          console.log("Market price added");
        },
      },

      scopes: {
        recent: {
          order: [["priceDate", "DESC"]],
        },

        byQuality(quality) {
          return {
            where: { quality },
          };
        },
      },
    }
  );

  return MarketPrice;
};