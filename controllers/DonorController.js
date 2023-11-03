const db = require('../database/models');
const { validationResult } = require('express-validator');
const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const { transport } = require('../config');

const Register = (req, res, next) => {
    // res.send("Register")
    res.render('donors/register', { title: 'register', layout: './layouts/sign-in', errors: [], donor: {} });
}
const PostRegister = async (req, res, next) => {
    const result = validationResult(req);
    const donor = Donor.build(req.body);
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