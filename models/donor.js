'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donor.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    city:DataTypes.STRING,
    NID:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Donor',
  });
  return Donor;
};