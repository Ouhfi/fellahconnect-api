const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LandPlot extends Model {
    static associate(models) {
      LandPlot.belongsTo(models.Farmer, {
        foreignKey: "farmerId",
        as: "farmer",
      });

      LandPlot.hasMany(models.Harvest, {
        foreignKey: "landPlotId",
        as: "harvests",
      });
    }
  }

  LandPlot.init(
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

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      area: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0.1,
        },
      },

      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      soilType: {
        type: DataTypes.ENUM(
          "Clay",
          "Sandy",
          "Loamy",
          "Rocky"
        ),
        allowNull: false,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "LandPlot",
      tableName: "land_plots",
      timestamps: true,
    }
  );

  return LandPlot;
};