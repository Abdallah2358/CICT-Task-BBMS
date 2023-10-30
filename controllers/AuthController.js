//js
const nodemailer = require("nodemailer");
const db = require('../models');
const { validationResult } = require('express-validator');
const Donor = db.Donor;
const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "7adb1ed27ddce9",
        pass: "dad80e5997a305"
    }
});
const GetDonorsRegister = (req, res, next) => {
    res.render('donors/register', { title: 'register', layout: './layouts/signin', errors: [], donor: {} });
}
const PostDonorsRegister = async (req, res, next) => {
    const result = validationResult(req);
    const donor = Donor.build(req.body);
    if (result.isEmpty()) {
        donor.save();
      await  transport.sendMail({
            from: "no-reply@bbms.eg",
            to: donor.email,
            subject: "Welcome to BBMS",
            html: "<h1>Thank you for registering</h1>"
                + "<h2>you donation is pending approval</h2>",
        });
        res.redirect("/auth/donor/register");
    }
    const errors = result.array()
    // res.send({ errors, reqBody: req.body });
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