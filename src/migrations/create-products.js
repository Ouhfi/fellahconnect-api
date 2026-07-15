"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      category: {
        type: Sequelize.ENUM(
          "Vegetable",
          "Fruit",
          "Cereal",
          "Legume",
          "Other"
        ),
        allowNull: false,
      },

      unit: {
        type: Sequelize.ENUM(
          "kg",
          "ton",
          "box",
          "piece"
        ),
        allowNull: false,
        defaultValue: "kg",
      },

      seasonStart: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      seasonEnd: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("products", ["category"]);
    await queryInterface.addIndex("products", ["seasonStart", "seasonEnd"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("products");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_category";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_products_unit";'
    );
  },
};