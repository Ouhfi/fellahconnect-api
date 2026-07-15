"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      role: {
        type: Sequelize.ENUM("admin", "farmer"),
        allowNull: false,
        defaultValue: "farmer",
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

    // Indexes
    await queryInterface.addIndex("users", ["email"]);
    await queryInterface.addIndex("users", ["username"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  },
};