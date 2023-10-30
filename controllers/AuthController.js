//js
const db = require('../models');
const {  validationResult } = require('express-validator');
const Donor = db.Donor;

const GetDonorsRegister = (req, res, next) => {
    res.render('donors/register', { title: 'register', layout: './layouts/signin', errors: [] , donor: {}});
}
const PostDonorsRegister = (req, res, next) => {
    const result = validationResult(req);
    // res.send(result);
    const { fName, NID, city, email } = req.body;
    const donor = Donor.build({
        fullName: fName,
        NID: NID,
        city: city,
        email: email
    });
    if (result.isEmpty()) {
        donor.save();
        res.redirect("/auth/register");
    }
    const errors = result.array()
    // res.send(errors);
    res.render('donors/register', {
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