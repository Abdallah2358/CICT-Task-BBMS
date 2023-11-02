'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BloodRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BloodRequest.init({
    hospital_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Hospitals',
        key: 'id'
      }
    },
    patient_state: DataTypes.ENUM('Immediate', 'Urgent', 'Normal'),
    blood_type_id: {
      type: DataTypes.STRING,
      references: {
        model: 'BloodTypes',
        key: 'id'
      }
    },
    city_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'City',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'BloodRequest',
  });
  return BloodRequest;
};