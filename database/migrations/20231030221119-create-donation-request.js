'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DonationRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      donor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Donors',
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
      status: {
        type: Sequelize.ENUM('Pending', 'Accepted', 'Rejected'),
      },
      test_result: {
        type: Sequelize.ENUM('Pending', 'Positive', 'Negative'),
      },

      accepted_by_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Admins',
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
    await queryInterface.dropTable('DonationRequests');
  }
};