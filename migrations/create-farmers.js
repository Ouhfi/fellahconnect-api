"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("farmers", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      fullName: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      region: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      verificationStatus: {
        type: Sequelize.ENUM(
          "pending",
          "verified",
          "rejected"
        ),
        allowNull: false,
        defaultValue: "pending",
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

    await queryInterface.addIndex("farmers", ["userId"]);
    await queryInterface.addIndex("farmers", ["city"]);
    await queryInterface.addIndex("farmers", ["region"]);
    await queryInterface.addIndex("farmers", ["verificationStatus"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("farmers");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_farmers_verificationStatus";'
    );
  },
};