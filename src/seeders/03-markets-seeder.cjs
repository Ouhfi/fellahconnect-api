'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('markets', [
      {
        id: 1,
        name: 'Casablanca Wholesale Market (Marché de Gros)',
        city: 'Casablanca',
        region: 'Casablanca-Settat',
        type: 'Wholesale',
        address: 'Sidi Othmane, Casablanca',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Marrakech Souq Retail Market',
        city: 'Marrakech',
        region: 'Marrakech-Safi',
        type: 'Retail',
        address: 'Medina, Marrakech',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Agadir Inezgane Wholesale Market',
        city: 'Agadir',
        region: 'Souss-Massa',
        type: 'Wholesale',
        address: 'Inezgane, Agadir',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Fes Jdid Local Market',
        city: 'Fes',
        region: 'Fes-Meknes',
        type: 'Local',
        address: 'Mellah, Fes',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Tangier Wholesale Market',
        city: 'Tangier',
        region: 'Tangier-Tetouan-Al Hoceima',
        type: 'Wholesale',
        address: 'Route de Tetouan, Tangier',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('markets', null, {});
  }
};
