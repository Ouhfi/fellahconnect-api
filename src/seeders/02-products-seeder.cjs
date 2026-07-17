'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        id: 1,
        name: 'Tomatoes',
        category: 'Vegetable',
        unit: 'kg',
        seasonStart: 4,
        seasonEnd: 10,
        description: 'Fresh Moroccan red tomatoes, major staple in local markets.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Potatoes',
        category: 'Vegetable',
        unit: 'kg',
        seasonStart: 3,
        seasonEnd: 8,
        description: 'Moroccan potatoes sourced from the Sous-Massa region.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Oranges',
        category: 'Fruit',
        unit: 'kg',
        seasonStart: 1,
        seasonEnd: 5,
        description: 'Sweet and juicy Berkane oranges.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Wheat',
        category: 'Cereal',
        unit: 'ton',
        seasonStart: 5,
        seasonEnd: 8,
        description: 'Hard and soft wheat harvested in the Gharb plains.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Olives',
        category: 'Fruit',
        unit: 'kg',
        seasonStart: 9,
        seasonEnd: 12,
        description: 'Moroccan olives, perfect for oil extraction or table use.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Lentils',
        category: 'Legume',
        unit: 'kg',
        seasonStart: 4,
        seasonEnd: 7,
        description: 'Local Zaer lentils, highly appreciated for their rich taste.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
