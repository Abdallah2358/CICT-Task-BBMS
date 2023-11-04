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
const handleRequests = async (request, options) => {
  const unfulfilledRequests = await db.BloodRequest.findAll({
    where: { fulfilled: false },
    order: [['patient_state', 'ASC'], ['createdAt', 'ASC']]
  });
  if (unfulfilledRequests.length >= 10) {
    const donations = await db.Donation.findAll(
      { where: { in_stock: true }, order: [['createdAt', 'ASC']] });
    for (const req of unfulfilledRequests) {
      for (const donation of donations) {
        if (req.blood_type_id === donation.blood_type_id) {
          await sequelize.transaction(async (t) => {
            req.donation_id = donation.id;
            req.fulfilled = true;
            await req.save({ transaction: t });
            donation.in_stock = false;
            await donation.save({ transaction: t });
          });
          break;
        }
      }
    }
  }
}

db.City.hasMany(db.Hospital, { foreignKey: 'city_id', as: 'hospitals' });
db.City.hasMany(db.Donor, { foreignKey: 'city_id', as: 'donors' });
db.City.hasMany(db.BloodRequest, { foreignKey: 'city_id', as: 'blood_requests' });

db.BloodType.hasMany(db.Donor, { foreignKey: 'blood_type_id', as: 'donors' });
db.BloodType.hasMany(db.Donation, { foreignKey: 'blood_type_id', as: 'donations' });
db.BloodType.hasMany(db.DonationRequest, { foreignKey: 'blood_type_id', as: 'donation_requests' });
db.BloodType.hasMany(db.Admin, { foreignKey: 'blood_type_id', as: 'admins' });
db.BloodType.hasMany(db.HospitalOfficial, { foreignKey: 'blood_type_id', as: 'hospital_officials' });
db.BloodType.hasMany(db.BloodRequest, { foreignKey: 'blood_type_id', as: 'blood_requests' });

db.Donor.hasMany(db.Donation, { foreignKey: 'donor_id', as: 'donations' });
db.Donor.hasMany(db.DonationRequest, { foreignKey: 'donor_id', as: 'donation_requests' });
db.Donor.belongsTo(db.City, { foreignKey: 'city_id', as: 'city' });
db.Donor.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });

db.Donation.belongsTo(db.Donor, { foreignKey: 'donor_id', as: 'donor' });
db.Donation.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });
db.Donation.belongsTo(db.DonationRequest, { foreignKey: 'blood_type_id', as: 'donation_request' });

db.DonationRequest.belongsTo(db.Donor, { foreignKey: 'donor_id', as: 'donor' });
db.DonationRequest.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });

db.Hospital.hasMany(db.HospitalOfficial, { foreignKey: 'hospital_id', as: 'hospital_officials' });
db.Hospital.belongsTo(db.City, { foreignKey: 'city_id', as: 'city' });

db.HospitalOfficial.belongsTo(db.Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
db.HospitalOfficial.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });

db.BloodRequest.belongsTo(db.City, { foreignKey: 'city_id', as: 'city' });
db.BloodRequest.belongsTo(db.Hospital, { foreignKey: 'hospital_id', as: 'hospital' });
db.BloodRequest.belongsTo(db.Donation, { foreignKey: 'donation_id', as: 'donation' });
db.BloodRequest.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });

db.Admin.belongsTo(db.BloodType, { foreignKey: 'blood_type_id', as: 'blood_type' });
db.Admin.hasMany(db.DonationRequest, { foreignKey: 'accepted_by_id', as: 'donation_requests' });

//hooks
db.BloodRequest.addHook('afterCreate', 'handleRequestsOnBR', handleRequests);
db.Donation.addHook('afterCreate', 'handleRequestsOnD', handleRequests);


module.exports = db;
