"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sale_offers", {
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
        onDelete: "RESTRICT",
      },

      harvestId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "harvests",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
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

      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      unitPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      totalPrice: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },

      offerDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "pending",
          "accepted",
          "rejected",
          "sold"
        ),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("sale_offers", ["farmerId"]);
    await queryInterface.addIndex("sale_offers", ["harvestId"]);
    await queryInterface.addIndex("sale_offers", ["status"]);
    await queryInterface.addIndex("sale_offers", ["offerDate"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("sale_offers");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_sale_offers_status";'
    );
  },
};