'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HospitalOfficial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  HospitalOfficial.init({
    national_id: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
    },
    username: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    title: DataTypes.STRING,
    blood_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'BloodType',
        key: 'id',
      }
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hospital',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'HospitalOfficial',
  });
  return HospitalOfficial;
};