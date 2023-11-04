'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Donations', {
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
      donation_request_id: {
        type: Sequelize.INTEGER
        , references: {
          model: 'DonationRequests',
          key: 'id',
        }
      },
      in_stock: {
        type: Sequelize.BOOLEAN,
        defaultValue: true

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
      'Donations',
      ['in_stock'],
      {
        indicesType: 'BTREE',
      }
    );

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Donations');
  }
};