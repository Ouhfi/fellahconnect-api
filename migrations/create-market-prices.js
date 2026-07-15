"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("market_prices", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      marketId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "markets",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      quality: {
        type: Sequelize.ENUM("A", "B", "C"),
        allowNull: false,
        defaultValue: "A",
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      priceDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
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

    // Indexes
    await queryInterface.addIndex("market_prices", [
      "marketId",
      "productId",
      "priceDate",
      "quality",
    ], {
      unique: true,
      name: "market_price_unique",
    });

    await queryInterface.addIndex("market_prices", ["priceDate"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("market_prices");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_market_prices_quality";'
    );
  },
};