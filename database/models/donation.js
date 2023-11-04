'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Donation.init({
    donor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Donor',
        key: 'id',
      }
    },
    blood_type_id: {
      type: DataTypes.STRING
    },
    donation_request_id: {
      type: DataTypes.INTEGER
      , references: {
        model: 'DonationRequest',
        key: 'id',
      }
    },
    in_stock: {
      type: DataTypes.BOOLEAN,
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'City',
        key: 'id',
      }
    }
  }, {
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};