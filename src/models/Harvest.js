const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Harvest extends Model {
    static associate(models) {
      Harvest.belongsTo(models.Farmer, {
        foreignKey: "farmerId",
        as: "farmer",
      });

      Harvest.belongsTo(models.Product, {
        foreignKey: "productId",
        as: "product",
      });

      Harvest.belongsTo(models.LandPlot, {
        foreignKey: "landPlotId",
        as: "landPlot",
      });

      Harvest.hasMany(models.SaleOffer, {
        foreignKey: "harvestId",
        as: "saleOffers",
      });
    }
  }

  Harvest.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      farmerId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      productId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      landPlotId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.1,
        },
      },

      unit: {
        type: DataTypes.ENUM("kg", "ton"),
        defaultValue: "kg",
      },

      harvestDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM(
          "planned",
          "ready",
          "sold"
        ),
        defaultValue: "planned",
      },
    },
    {
      sequelize,
      modelName: "Harvest",
      tableName: "harvests",
      timestamps: true,

      hooks: {
        beforeSave: (harvest) => {
          if (harvest.quantity <= 0) {
            throw new Error("Quantity must be greater than zero");
          }
        },
      },

      scopes: {
        ready: {
          where: {
            status: "ready",
          },
        },

        bySeason(start, end) {
          return {
            where: {
              harvestDate: {
                [sequelize.Sequelize.Op.between]: [start, end],
              },
            },
          };
        },
      },
    }
  );

  return Harvest;
};