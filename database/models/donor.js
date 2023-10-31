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
    full_name: DataTypes.STRING,
    email: DataTypes.STRING,
    city:DataTypes.STRING,
    NID:{
      type : DataTypes.STRING,
      primaryKey : true,
      allowNull : false,
    },
    blood_type:DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  }, {
    sequelize,
    modelName: 'Donor',
  });
  return Donor;
};