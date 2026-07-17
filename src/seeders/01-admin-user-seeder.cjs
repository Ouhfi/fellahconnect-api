'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const farmerPassword = await bcrypt.hash('farmer123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        username: 'admin',
        email: 'admin@fellahconnect.com',
        password: adminPassword,
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        username: 'ahmed_farmer',
        email: 'ahmed@fellahconnect.com',
        password: farmerPassword,
        role: 'farmer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        username: 'fatima_farmer',
        email: 'fatima@fellahconnect.com',
        password: farmerPassword,
        role: 'farmer',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
