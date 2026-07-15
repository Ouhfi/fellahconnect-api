"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("harvests", {
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

      landPlotId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "land_plots",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },

      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      unit: {
        type: Sequelize.ENUM("kg", "ton"),
        allowNull: false,
        defaultValue: "kg",
      },

      harvestDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          "planned",
          "ready",
          "sold"
        ),
        allowNull: false,
        defaultValue: "planned",
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

    await queryInterface.addIndex("harvests", ["farmerId"]);
    await queryInterface.addIndex("harvests", ["productId"]);
    await queryInterface.addIndex("harvests", ["status"]);
    await queryInterface.addIndex("harvests", ["harvestDate"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("harvests");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_harvests_unit";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_harvests_status";'
    );
  },
};