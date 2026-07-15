"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("markets", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      region: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      type: {
        type: Sequelize.ENUM(
          "Wholesale",
          "Retail",
          "Local"
        ),
        allowNull: false,
      },

      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

    await queryInterface.addIndex("markets", ["city"]);
    await queryInterface.addIndex("markets", ["region"]);
    await queryInterface.addIndex("markets", ["type"]);
    await queryInterface.addIndex("markets", ["isActive"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("markets");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_markets_type";'
    );
  },
};