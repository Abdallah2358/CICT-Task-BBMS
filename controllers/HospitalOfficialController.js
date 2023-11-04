const { render } = require("ejs");
const db = require("../database/models");
const HospitalOfficial = db.HospitalOfficial;
const Login = async (req, res, next) => {
    // return res.send('Hospital Official Login');
    return res.render('hospital-officials/login',
        {
            title: 'Hospital Official Login', official: {}, errors: [],
            layout: 'layouts/sign-in',
        });
}
const PostLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await HospitalOfficial.findOne({ where: { email, password } });
    if (!user) {
        return res.render('hospital-officials/login',
            {
                title: 'Hospital Official Login',
                errors: [{ msg: "The email and password does not match" }],
                official: { email, password },
                layout: 'layouts/sign-in',
            });
    }
    req.session.official = user;
    // res.send(req.session.official);
    res.redirect('/blood-requests');
}

// returns list view of resource
const index = (req, res, next) => {
    res.render('hospital-officials/index', { title: 'Hospital Officials' });
}

// returns single view of a resource
const show = (req, res, next) => {
    res.render('hospital-officials/show', { title: 'Hospital Officials' });
}

// returns create view for a resource
const create = (req, res, next) => {
    res.render('hospital-officials/create', { title: 'Hospital Officials', errors: {} });
}

// handles priesting the resource in the database
// may redirect to another action or return the status with errors if any 
const store = (req, res, next) => {
    //if  errors
    //   res.render('hospital-officials/create', { title: 'Hospital Officials' , errors:{} });
    //else
    //db.model.create ({req.body})  

}

// returns edit view for a resource
const edit = (req, res, next) => { }

// handles priesting updates to resource in the database
// may redirect to another action or return the status with errors if any 
const update = (req, res, next) => { }

// handles deleting a resource from database
// may redirect to another action or return the status with errors if any 
// we only added action here because the `delete` is a js keyword
const deleteAction = (req, res, next) => { }

module.exports = {
    Login,
    PostLogin,
    index,
    show,
    create,
    store,
    edit,
    update,
    deleteAction
};