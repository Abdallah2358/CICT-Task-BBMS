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
        type: Sequelize.STRING,
        references: {
          model: 'Donors',
          key: 'NID',
        }
      },
      blood_type: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
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