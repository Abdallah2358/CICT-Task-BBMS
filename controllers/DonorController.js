const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport, Cities, Blood_types } = require('../config');
const app = require('../app');
const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const City = db.City;
const BloodType = db.BloodType;

const Register = async (req, res, next) => {
    const cities = await Cities;
    const blood_types = await Blood_types;

    return res.render('donor/register',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            cities: cities, blood_types: blood_types
        });
}
const PostRegister = async (req, res, next) => {
    const cities = await Cities;
    const blood_types = await Blood_types;
    const result = validationResult(req);
    const donor = Donor.build(req.body);
    // res.send(result.array());
    if (result.isEmpty()) {
        await donor.save();
        const dr = await DonationRequest.create({
            donor_id: donor.id,
            blood_type_id: donor.blood_type_id,
            status: "pending",
            test_result: "pending",
        })
        // res.send({ dr, result: result.array() });
        await transport.sendMail({
            from: "no-reply@bbms.eg",
            to: donor.email,
            subject: "Welcome to BBMS",
            html: "<h1>Thank you for registering</h1>"
                + "<h2>you donation is pending approval</h2>",
        });
        return res.redirect("/");
    }
    const errors = result.array()
    // res.send({ errors, reqBody: req.body });
    return res.render('donor/register', {
        title: 'Donor Register',
        layout: './layouts/sign-in',
        errors: errors,
        donor: donor,
        cities: cities, blood_types: blood_types
    });
}

const Login = (req, res, next) => {
    // res.send('aaa');

    return res.render('donor/login',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            // cities: cities, blood_types: blood_types
        });
}
const PostLogin = (req, res) => {
    return res.render('donor/login',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            // cities: cities, blood_types: blood_types
        });
}
module.exports = {
    Register,
    PostRegister,
    Login,
    PostLogin,
};