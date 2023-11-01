'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DonationRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DonationRequest.init({
    donor_id: {
      type: DataTypes.STRING,
      // references: {
      //   model: 'Donor',
      //   key: 'NID',
      // }
    },
    blood_type: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    },
    test_result: {
      type: DataTypes.ENUM('pending', 'positive', 'negative'),
    },
    donation_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Donation',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'DonationRequest',
  });
  return DonationRequest;
};