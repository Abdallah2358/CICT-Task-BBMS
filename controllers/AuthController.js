const db = require('../database/models');
const { validationResult } = require('express-validator');
const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const { transport } = require('../config');

const GetDonorsRegister = (req, res, next) => {
    res.render('donors/register', { title: 'register', layout: './layouts/signin', errors: [], donor: {} });
}
const PostDonorsRegister = async (req, res, next) => {
    const result = validationResult(req);
    const donor = Donor.build(req.body);
    if (result.isEmpty()) {
        await donor.save();
        const dr = await DonationRequest.create({
            donor_id: donor.NID,
            blood_type: donor.blood_type,
            status: "pending",
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
        layout: './layouts/signin',
        errors: errors,
        donor: donor
    });
}

const GetLogin = (req, res) => {
    res.render("login", {
    });
}
module.exports = {
    GetDonorsRegister,
    PostDonorsRegister,
    GetLogin,
};