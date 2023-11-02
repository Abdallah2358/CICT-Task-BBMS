'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.City.hasMany(db.Hospital, { foreignKey: 'city_id' });
db.City.hasMany(db.Donor, { foreignKey: 'city' });
db.City.hasMany(db.BloodRequest, { foreignKey: 'city_id' });

db.BloodType.hasMany(db.Donor, { foreignKey: 'blood_type_id' });
db.BloodType.hasMany(db.Donation, { foreignKey: 'blood_type_id' });
db.BloodType.hasMany(db.DonationRequest, { foreignKey: 'blood_type_id' });
db.BloodType.hasMany(db.Admin, { foreignKey: 'blood_type_id' });
db.BloodType.hasMany(db.HospitalOfficial, { foreignKey: 'blood_type_id' });
db.BloodType.hasMany(db.BloodRequest, { foreignKey: 'blood_type_id' });

db.Donor.hasMany(db.Donation, { foreignKey: 'donor_id' });
db.Donor.hasMany(db.DonationRequest, { foreignKey: 'donor_id' });
db.Donor.belongsTo(db.City, { foreignKey: 'city' });
db.Donor.belongsTo(db.BloodType, { foreignKey: 'blood_type_id' });

db.Donation.belongsTo(db.Donor, { foreignKey: 'donor_id' });
db.Donation.belongsTo(db.BloodType, { foreignKey: 'blood_type_id' });

db.DonationRequest.belongsTo(db.Donor, { foreignKey: 'donor_id' });
db.DonationRequest.belongsTo(db.BloodType, { foreignKey: 'blood_type_id' });

db.Hospital.hasMany(db.HospitalOfficial, { foreignKey: 'hospital_id' });
db.Hospital.belongsTo(db.City, { foreignKey: 'city_id' });

db.HospitalOfficial.belongsTo(db.Hospital, { foreignKey: 'hospital_id' });
db.HospitalOfficial.belongsTo(db.BloodType, { foreignKey: 'blood_type_id' });

db.BloodRequest.belongsTo(db.City, { foreignKey: 'city_id' });
db.BloodRequest.belongsTo(db.Hospital, { foreignKey: 'hospital_id' });

db.Admin.belongsTo(db.BloodType, { foreignKey: 'blood_type_id' });
db.Admin.hasMany(db.DonationRequest, { foreignKey: 'accepted_by_id' });


module.exports = db;
