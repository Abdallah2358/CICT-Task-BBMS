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

    return res.render('donors/register',
        {
            title: 'register',
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
    return res.render('donors/register', {
        title: 'register',
        layout: './layouts/sign-in',
        errors: errors,
        donor: donor,
        cities: cities, blood_types: blood_types
    });
}

const Login = (req, res) => {
    res.render("login", {
    });
}
const PostLogin = (req, res) => {
    res.render("login", {
    });
}
module.exports = {
    Register,
    PostRegister,
    Login,
    PostLogin,
};