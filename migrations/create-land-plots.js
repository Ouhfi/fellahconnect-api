"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("land_plots", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      farmerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "farmers",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      area: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      soilType: {
        type: Sequelize.ENUM(
          "Clay",
          "Sandy",
          "Loamy",
          "Rocky"
        ),
        allowNull: false,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("land_plots", ["farmerId"]);
    await queryInterface.addIndex("land_plots", ["isActive"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("land_plots");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_land_plots_soilType";'
    );
  },
};