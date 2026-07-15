'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('market_prices', [
      {
        id: 1,
        marketId: 1, // Casablanca Wholesale Market
        productId: 1, // Tomatoes
        quality: 'A',
        price: 5.50,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        marketId: 1, // Casablanca Wholesale Market
        productId: 1, // Tomatoes
        quality: 'B',
        price: 4.00,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        marketId: 1, // Casablanca Wholesale Market
        productId: 2, // Potatoes
        quality: 'A',
        price: 6.00,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        marketId: 1, // Casablanca Wholesale Market
        productId: 3, // Oranges
        quality: 'A',
        price: 8.50,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        marketId: 3, // Agadir Inezgane Wholesale Market
        productId: 1, // Tomatoes
        quality: 'A',
        price: 4.80,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        marketId: 3, // Agadir Inezgane Wholesale Market
        productId: 2, // Potatoes
        quality: 'A',
        price: 5.20,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        marketId: 3, // Agadir Inezgane Wholesale Market
        productId: 3, // Oranges
        quality: 'A',
        price: 7.00,
        priceDate: '2026-07-15',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('market_prices', null, {});
  }
};
