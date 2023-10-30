//js
const db = require('../models');
const {  validationResult } = require('express-validator');
const User = db.User;

const GetDonorsRegister = (req, res, next) => {
    res.render('donors/register', { title: 'register', layout: './layouts/signin', errors: [] , user: {}});
}
const PostDonorsRegister = (req, res, next) => {
    const result = validationResult(req);
    // res.send(result);
    const { fName, NID, city, email } = req.body;
    const user = User.build({
        fullName: fName,
        NID: NID,
        city: city,
        email: email
    });
    if (result.isEmpty()) {
        user.save();
        res.redirect("/auth/register");
    }
    const errors = result.array()
    // res.send(errors);
    res.render('donors/register', {
        title: 'register',
        layout: './layouts/signin',
        errors: errors,
        user: user
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