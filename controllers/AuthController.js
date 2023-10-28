//js
const db = require('../models');
const User = db.User;
const GetRegister = (req, res,next) => {
    res.render('donors/register', { title: 'register', layout: './layouts/signin' });
}
const PostRegister = (req, res , next) => {
    const { fName, NID, city, email } = req.body;
    User .create({
        fullName: fName,
        NID: NID,
        city: city,
        email: email
    });
    // console.log(fName, NID, city, email);
    // res.render('donors/register', { title: 'register', layout: './layouts/signin' });

    res.redirect("/auth/register");
}

const GetLogin = (req, res) => {

    res.render("login", {
    });
}
module.exports = {
    GetRegister,
    PostRegister,
    GetLogin,
};