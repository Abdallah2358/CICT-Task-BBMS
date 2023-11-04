const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport, Cities, Blood_types } = require('../config');
const app = require('../app');


const { createHash } = require('crypto');

function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}

const Admin = db.Admin;
const Donor = db.Donor;
const DonationRequest = db.DonationRequest;
const City = db.City;
const BloodType = db.BloodType;

const index = async (req, res, next) => {
    // res.send(req.session.admin);
    if (req.session.admin) {

        return res.render('admin/index', {
            title: 'Admin',
            admin: req.session.admin,
        });
    }
    return res.redirect('/admin/login');
}

const Login = async (req, res, next) => {
    if (req.session.admin) {
        return res.redirect('/');
    }

    return res.render('admin/login',
        {
            title: 'Admin Login',
            layout: './layouts/sign-in',
            errors: [], admin: {},
            // cities: cities, blood_types: blood_types
        });
}
const PostLogin = async (req, res) => {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email: email, password: password } });
    if (admin) {
        req.session.admin = admin;
        const oldUrl = req.session.oldUrl || '/admin';
        req.session.oldUrl = null;
        return res.redirect(oldUrl);
    }
    return res.render('admin/login',
        {
            title: 'Donor Register',
            layout: './layouts/sign-in',
            errors: [{ msg: "The email and password does not match" }], admin: {
                email: email,
                password: password
            },
        });
}
module.exports = {
    index,
    Login,
    PostLogin,
};