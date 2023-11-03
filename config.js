// config.js
const dotenv = require('dotenv');
const nodemailer = require("nodemailer");
const db = require("./database/models");
dotenv.config();

const cities = db.City.findAll();
const blood_types = db.BloodType.findAll();

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});
module.exports = {
    transport: transport,
    endpoint: process.env.API_URL,
    masterKey: process.env.API_KEY,
    port: process.env.PORT,
    Cities: cities,
    Blood_types: blood_types
};