'use strict';
/** @type {import('sequelize-cli').Migration} */
const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donors', {
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
      full_name: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      city_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Cities',
          key: 'id',
        }
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
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')

      }
    });
    await queryInterface.bulkInsert('Donors',
      [
        { national_id: '123456789',city_id:1, full_name: 'Abdallah El Hadidi', password: hash('password'), email: 'abdallah@example.com',  blood_type_id: 1 },
      ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Donors');
  }
};
