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
      type: DataTypes.INTEGER,
      references: {
        model: 'Donor',
        key: 'id',
      }
    },
    blood_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'BloodType',
        key: 'id',
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Accepted', 'Rejected'),
    },
    test_result: {
      type: DataTypes.ENUM('Pending', 'Positive', 'Negative'),
    },
    accepted_by_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Admins',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'DonationRequest',
  });
  return DonationRequest;
};