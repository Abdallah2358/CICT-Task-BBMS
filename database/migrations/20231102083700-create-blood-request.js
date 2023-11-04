'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BloodRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hospital_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Hospitals',
          key: 'id',
        }
      },
      patient_state: {
        type: Sequelize.ENUM,
        values: ['Immediate', 'Urgent', 'Normal'],
      },
      blood_type_id: {
        type: Sequelize.SMALLINT  ,
        references: {
          model: 'BloodTypes',
          key: 'id',
        }
      },
      city_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cities',
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BloodRequests');
  }
};
