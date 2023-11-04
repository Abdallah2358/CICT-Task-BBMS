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
db.Donation.belongsTo(db.City, { foreignKey: 'city_id', as: 'city' });
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

const fulfillRequest = async (request, donation) => {
  await sequelize.transaction(async (t) => {
    request.donation_id = donation.id;
    request.fulfilled = true;
    await request.save({ transaction: t });
    donation.in_stock = false;
    await donation.save({ transaction: t });
  });
}
const calculateDistance = (city1, city2) => {
  const x = city1.latitude - city2.latitude;
  const y = city1.longitude - city2.longitude;
  return Math.sqrt(x * x + y * y);
}
const findNearestDonation = async (request, donations) => {
  let minDistance = Infinity;
  let nearestCity = null;
  for (const donation of donations) {
    if (donation.blood_type_id === request.blood_type_id) {
      const distance = calculateDistance(request.city, donation.city);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = donation.city;
      }
    }
  }
  return { minDistance, nearestCity };
}
const compareState = (state1, state2) => {
  const StateEnum = {
    'Immediate': 1,
    'Urgent': 2,
    'Normal': 3
  };
  return StatusEnum[state1] === StatusEnum[state2];
}
const handleRequests = async (request, options) => {
  const states = ['Immediate', 'Urgent', 'Normal'];
  const unfulfilledRequestsCount = await db.BloodRequest.count({
    where: { fulfilled: false }
  });
  const donationsInStockCount = await db.Donation.count({ where: { in_stock: true } });
  // No need to handle requests if there are no unfulfilled requests
  // or if there are no donations in stock
  let stop = false;
  if (unfulfilledRequestsCount >= 10 && donationsInStockCount) {
    //   const unfulfilledRequests = await db.BloodRequest.count({
    //     where: { fulfilled: false },
    //     // here we are sure we have the earliest Immediate requests first
    //     // then the earliest Urgent requests
    //     // then the earliest Normal requests
    //     // we assume that the hospital will update the state of the patient 
    //     // so that there is no starvation of requests
    //     order: [['patient_state', 'ASC'], ['createdAt', 'ASC']],
    //     include: ['city']
    //   });
    const donations = await db.Donation.findAll(
      {
        where: { in_stock: true },
        order: [['createdAt', 'ASC']],
        include: ['city']
      });

    // this object defines the search radius for each state
    // we start with 25km for Immediate requests since it should be fulfilled
    // as soon as possible and we don't want to waste time searching for a match
    let distances = {
      'Immediate': 25,
      'Urgent': 15,
      'Normal': 10
    };
    // this constant defines how big the search area is
    const radius = 100;
    // this constant defines how fast the search area expands
    const step = 10;
    // depending on these 2 variables we can calculate how many times we need to loop
    // through the donations array
    // although the ideal case is having the largest radius
    // with the smallest steps
    // we can't do that because we don't have enough computing resources
    // also if we make the step too small we might end up wasting the 

    // save queried requests in this object so we don't have to query them again
    const requests = {};

    while (donations.length && !stop && distances['Immediate'] < radius) {
      states.forEach(async (state) => {
        if (!requests[state]) {
          requests[state] = await db.BloodRequest.count({
            where: { fulfilled: false, patient_state: state },
            order: [['patient_state', 'ASC'], ['createdAt', 'ASC']],
            include: ['city']
          });
        }
        let blood_type_exists = false;
        for (const [i, req] of requests[state]) {
          // check if there is any stock at same city
          for (const [j, donation] of donations) {
            const sameCity = req.city_id === donation.city_id;
            const sameBloodType = req.blood_type_id === donation.blood_type_id;
            if (sameCity && sameBloodType) {
              await fulfillRequest(req, donation);
              delete donations[j];
              delete requests[state][i];
              break;
            }
            //since we already checked all donations it is good to make
            //sure that the blood type actually exists before continuing
            if (sameBloodType) {
              blood_type_exists = true;
            }
          }
          if (blood_type_exists) {
            const { minDistance, nearestCity } = findNearestDonation(req, donations);
            // here we make sure that the nearest city is within the search radius
            // and that the nearest city has the same blood type
            if (minDistance < distances[state]) {
              const donationIndex = donations.findIndex(d => d.city_id === nearestCity.id);
              await fulfillRequest(req, donations[donationIndex]);
              delete donations[donationIndex];
              delete requests[state][i];
              blood_type_exists = false;
            }
          }
        }
        // keep expanding the search radius by 10km until we find a match
        // or we reach our limit of 100km 
        // we made the limit at 100km because we assume that the hospital
        distances[state] += step;
      });

    }
  }
}


//hooks
db.BloodRequest.addHook('afterCreate', 'handleRequestsOnBR', handleRequests);
db.Donation.addHook('afterCreate', 'handleRequestsOnD', handleRequests);


module.exports = db;
