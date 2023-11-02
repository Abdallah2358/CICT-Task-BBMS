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
        type: Sequelize.INTEGER
      },
      patient_state: {
        type: Sequelize.ENUM
      },
      blood_type_id: {
        type: Sequelize.SMALLINT  ,
        references: {
          model: 'BloodTypes',
          key: 'id',
        }
      },
      city_id: {
        type: Sequelize.INTEGER
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BloodRequests');
  }
};
official