'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Admins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      national_id: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      full_name: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      blood_type_id: {
        type: Sequelize.SMALLINT,
        references: {
          model: 'BloodTypes',
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    await queryInterface.bulkInsert('BloodTypes',
      [
        { national_id: '123456789', username: 'admin1', full_name: 'admin1', password: 'password', email: 'admin@example.com', title: 'Manager', blood_type_id: 1 },
      ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Admins');
  }
};