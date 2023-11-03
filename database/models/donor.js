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
    password: {
      type: DataTypes.STRING
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'City',
        key: 'id'
      }
    },
    national_id: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    blood_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'BloodType',
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'Donor',
    
  });
  return Donor;
};