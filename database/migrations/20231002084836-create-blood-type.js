'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BloodTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.SMALLINT
      },
      name: {
        type: Sequelize.STRING
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
    await queryInterface.bulkInsert('BloodTypes',
      [
        { name: 'A+' }, { name: 'A-' }, { name: 'B+' }, { name: 'B-' },
        { name: 'AB+' }, { name: 'AB-' }, { name: 'O+' }, { name: 'O-' }
      ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BloodTypes');
  }
};