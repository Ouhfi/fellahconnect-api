const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Farmer extends Model {
    static associate(models) {
      Farmer.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      Farmer.hasMany(models.LandPlot, {
        foreignKey: "farmerId",
        as: "landPlots",
      });

      Farmer.hasMany(models.Harvest, {
        foreignKey: "farmerId",
        as: "harvests",
      });

      Farmer.hasMany(models.SaleOffer, {
        foreignKey: "farmerId",
        as: "saleOffers",
      });
    }
  }

  Farmer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^(\\+212|0)[5-7][0-9]{8}$/,
        },
      },

      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      region: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      verificationStatus: {
        type: DataTypes.ENUM(
          "pending",
          "verified",
          "rejected"
        ),
        defaultValue: "pending",
      },
    },
    {
      sequelize,
      modelName: "Farmer",
      tableName: "farmers",
      timestamps: true,

      scopes: {
        verified: {
          where: {
            verificationStatus: "verified",
          },
        },

        byRegion(region) {
          return {
            where: {
              region,
            },
          };
        },
      },

      hooks: {
        afterCreate: async (farmer) => {
          console.log(
            `Farmer ${farmer.firstName} created`
          );
        },
      },
    }
  );

  return Farmer;
};