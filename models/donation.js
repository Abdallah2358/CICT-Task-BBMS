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
      type: DataTypes.STRING,
      references: {
        model: 'Donor',
        key: 'NID',
      }
    },
    blood_type: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Donation',
  });
  return Donation;
};