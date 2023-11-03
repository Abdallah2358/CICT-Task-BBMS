'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      longitude: {
        type: Sequelize.FLOAT
      },
      latitude: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')

      }
    });
    await queryInterface.bulkInsert('Cities', [
      { name: 'Cairo', longitude: 31.2357, latitude: 30.0444 },
      { name: 'Alexandria', longitude: 29.9553, latitude: 31.2222 },
      { name: 'Giza', longitude: 31.2058, latitude: 30.0131 },
      { name: 'Shubra El-Kheima', longitude: 31.2565, latitude: 30.1230 },
      { name: 'Port Said', longitude: 32.2841, latitude: 31.2565 },
      { name: 'Suez', longitude: 32.5498, latitude: 29.9668 },
      { name: 'Luxor', longitude: 32.6407, latitude: 25.0159 },
      { name: 'El-Mansura', longitude: 31.0379, latitude: 31.3807 },
      { name: 'El-Mahalla El-Kubra', longitude: 31.1667, latitude: 30.9667 },
      { name: 'Tanta', longitude: 30.7885, latitude: 31.0000 },
      { name: 'Asyut', longitude: 31.1837, latitude: 27.1828 },
      { name: 'Ismailia', longitude: 32.2833, latitude: 30.5833 },
      { name: 'Fayyum', longitude: 30.8418, latitude: 29.3099 },
      { name: 'Zagazig', longitude: 31.5167, latitude: 30.5833 },
      { name: 'Aswan', longitude: 32.9000, latitude: 24.0833 },
      { name: 'Damietta', longitude: 31.4167, latitude: 31.4167 },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Cities');
  }
};