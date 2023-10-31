//js
const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport } = require('../config');

const DonationRequest = db.DonationRequest;
const index =  async (req, res, next) => {
    const donation_requests = await DonationRequest.findAll();
    // res.send({donation_requests:donation_requests});
    res.render('donation_request/index', { title: 'Donation Requests', donation_requests: donation_requests });
}
const show = async (req, res, next) => {
    const dr = await DonationRequest.findOne({ where: { id: req.params.id } });
    // res.send({ r: req.params.id });
    res.render('donation_request/show',
        {
            title: 'Donation Request #' + req.params.id,
            request: dr
        });
}




module.exports = {
    index,
    show,
};