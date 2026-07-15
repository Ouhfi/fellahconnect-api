'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('harvests', [
      {
        id: 1,
        farmerId: 1, // Ahmed Alami
        productId: 1, // Tomatoes
        landPlotId: 1, // Souss Tomato Field
        quantity: 1500,
        unit: 'kg',
        harvestDate: '2026-06-15',
        status: 'ready',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        farmerId: 1, // Ahmed Alami
        productId: 3, // Oranges
        landPlotId: 2, // Souss Orange Orchard
        quantity: 5000,
        unit: 'kg',
        harvestDate: '2026-03-20',
        status: 'sold',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        farmerId: 2, // Fatima Benslimane
        productId: 5, // Olives
        landPlotId: 3, // Ourika Olive Grove
        quantity: 2000,
        unit: 'kg',
        harvestDate: '2026-10-10',
        status: 'planned',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('harvests', null, {});
  }
};
