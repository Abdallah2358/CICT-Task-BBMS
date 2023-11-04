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
        type: Sequelize.SMALLINT,
        references: {
          model: 'BloodTypes',
          key: 'id',
        }
      },
      donation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Donations',
          key: 'id',
        }
      },
      fulfilled: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addIndex(
      'BloodRequests',
      ['fulfilled'],
      {
        indicesType: 'BTREE',
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BloodRequests');
  }
};
