import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class SaleOffer extends Model {
    static associate(models) {
      SaleOffer.belongsTo(models.Farmer, {
        foreignKey: "farmerId",
        as: "farmer",
      });

      SaleOffer.belongsTo(models.Harvest, {
        foreignKey: "harvestId",
        as: "harvest",
      });

      SaleOffer.belongsTo(models.Market, {
        foreignKey: "marketId",
        as: "market",
      });
    }
  }

  SaleOffer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      farmerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      harvestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      marketId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.1,
        },
      },

      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },

      offerDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "pending",
          "accepted",
          "rejected",
          "sold"
        ),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "SaleOffer",
      tableName: "sale_offers",
      timestamps: true,

      hooks: {
        beforeSave: (offer) => {
          offer.totalPrice = offer.quantity * offer.unitPrice;
        },
      },

      scopes: {
        pending: {
          where: {
            status: "pending",
          },
        },

        active: {
          where: {
            status: ["pending", "accepted"],
          },
        },
      },

      indexes: [
        {
          fields: ["farmerId"],
        },
        {
          fields: ["harvestId"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["offerDate"],
        },
      ],
    }
  );

  return SaleOffer;
};