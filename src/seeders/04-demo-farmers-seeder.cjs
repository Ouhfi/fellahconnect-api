'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Farmers
    await queryInterface.bulkInsert('farmers', [
      {
        id: 1,
        userId: 2, // ahmed_farmer
        firstName: 'Ahmed',
        lastName: 'Alami',
        phone: '0612345678',
        city: 'Agadir',
        region: 'Souss-Massa',
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        userId: 3, // fatima_farmer
        firstName: 'Fatima',
        lastName: 'Benslimane',
        phone: '0687654321',
        city: 'Marrakech',
        region: 'Marrakech-Safi',
        verificationStatus: 'verified',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Seed Land Plots
    await queryInterface.bulkInsert('land_plots', [
      {
        id: 1,
        farmerId: 1,
        name: 'Souss Tomato Field',
        area: 5.5,
        location: 'Taroudant, Agadir',
        soilType: 'Sandy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        farmerId: 1,
        name: 'Souss Orange Orchard',
        area: 12.0,
        location: 'Chtouka, Agadir',
        soilType: 'Loamy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        farmerId: 2,
        name: 'Ourika Olive Grove',
        area: 8.2,
        location: 'Ourika Valley, Marrakech',
        soilType: 'Clay',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('land_plots', null, {});
    await queryInterface.bulkDelete('farmers', null, {});
  }
};
