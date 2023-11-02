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
          key: 'national_id',
        }
      },
      blood_type_id: {
        type: Sequelize.SMALLINT  ,
        references: {
          model: 'BloodTypes',
          key: 'id',
        }
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
      },
      test_result: {
        type: Sequelize.ENUM('pending', 'positive', 'negative'),
      },
      donation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Donations',
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DonationRequests');
  }
};