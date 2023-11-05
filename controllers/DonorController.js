const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport, Cities, Blood_types, hash } = require('../config');
const app = require('../app');




const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const City = db.City;
const BloodType = db.BloodType;


const show = async (req, res, next) => {
    const donor = await Donor.findOne({ where: { id: req.params.id }, include: ['city', 'blood_type'] });
    return res.render('donors/show', { title: 'Donor #' + req.params.id, donor: donor });
}
const Register = async (req, res, next) => {
    const cities = await Cities;
    const blood_types = await Blood_types;
    // return res.send('register');
    return res.render('donors/register',
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
    return res.render('donors/register', {
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
    if (req.session.donor) {
        return res.redirect('/');
    }

    return res.render('donors/login',
        {
            title: 'Donor Login',
            layout: './layouts/sign-in',
            errors: [], donor: {},
            // cities: cities, blood_types: blood_types
        });
}
const PostLogin = async (req, res) => {
    let { email, password } = req.body;
    password = hash(password);
    const donor = await Donor.findOne({ where: { email: email, password: password } });

    if (!donor) {
        return res.render('donors/login',
            {
                title: 'Donor Register',
                layout: './layouts/sign-in',
                errors: [{ msg: "The email and password does not match" }], donor: {
                    email: email,
                    password: password
                },
            });
    }
    req.session.donor = donor;
    const oldUrl = req.session.oldUrl || '/';
    req.session.oldUrl = null;
    return res.redirect(oldUrl);
}
module.exports = {
    show,
    Register,
    PostRegister,
    Login,
    PostLogin,
    Logout
};