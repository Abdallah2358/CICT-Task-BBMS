const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport } = require('../config');

const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const City = db.City;
const BloodType = db.BloodType;

const Register = async (req, res, next) => {
    const cities = await City.findAll();
    const blood_types = await db.BloodType.findAll();
    res.render('donors/register',
        {
            title: 'register',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            cities: cities, blood_types : blood_types
        });
}
const PostRegister = async (req, res, next) => {
    const donor= await Donor.findOne({ where: { national_id: req.body.national_id } });
    const result = validationResult(req);
    res.send(donor);
    // const donor = Donor.build(req.body);
    if (result.isEmpty()) {
        await donor.save();
        const dr = await DonationRequest.create({
            donor_id: donor.national_id,
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
        return res.redirect("/auth/donor/register");
    }
    const errors = result.array()
    // res.send({ errors, reqBody: req.body });
    return res.render('donors/register', {
        title: 'register',
        layout: './layouts/sign-in',
        errors: errors,
        donor: donor
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