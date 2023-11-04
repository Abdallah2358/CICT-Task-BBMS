const db = require('../database/models');
const { transport } = require('../config');


const Donation = db.Donation;

// returns list view of resource
const index = async (req, res, next) => {
    const donations = await Donation.findAll({ include: ['donation_request', 'blood_type'] });
    // res.send(donations);
    return res.render('donation/index', { title: 'Donations', donations: donations });
}

// returns single view of a resource
const show = async (req, res, next) => {
    const donation = await Donation.findOne({ include: ['donor', 'blood_type'] });
    // return res.send(donation.donor);
    return res.render('donation/show',
        { title: ('Donation #' + donation.id), donation: donation });
}

// returns create view for a resource
const create = (req, res, next) => {
    res.render('donation/create', { title: 'Donations', errors: {} });
}

// handles priesting the resource in the database
// may redirect to another action or return the status with errors if any 
const store = (req, res, next) => {
    //if  errors
    //   res.render('donation/create', { title: 'Donations' , errors:{} });
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
    index,
    show,
    create,
    store,
    edit,
    update,
    deleteAction
};