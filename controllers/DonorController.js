const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport, Cities, Blood_types } = require('../config');
const app = require('../app');


const { createHash } = require('crypto');

function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

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
    donor.password = hash(donor.password);

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
        req.session.donor = donor;
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
const Logout = async (req, res, next) => {
    req.session.destroy();
    return res.redirect('/');
}
const Login = async (req, res, next) => {
    // res.send('aaa');
    if (req.session.donor) {
        return res.redirect('/');
    }

    return res.render('donor/login',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            // cities: cities, blood_types: blood_types
        });
}
const PostLogin = async (req, res) => {
    let { email, password } = req.body;
    password = hash(password);
    const donor = await Donor.findOne({ where: { email: email, password: password } });
    if (donor) {
        req.session.donor = donor;
        return res.redirect('/');
    }
    return res.render('donor/login',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [{ msg: "The email and password does not match" }], donor: {
                email: email,
                password: password
            },
            // cities: cities, blood_types: blood_types
        });
}
module.exports = {
    Register,
    PostRegister,
    Login,
    PostLogin,
    Logout
};