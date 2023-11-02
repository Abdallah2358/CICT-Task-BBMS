//js
const db = require('../database/models');
const { validationResult } = require('express-validator');
const { transport } = require('../config');

const Donor = db.Donor;
const Donation = db.Donation;
const DonationRequest = db.DonationRequest;

const index = async (req, res, next) => {
    const donation_requests = await DonationRequest.findAll();
    // res.send({donation_requests:donation_requests});
    res.render('donation-request/index', { title: 'Donation Requests', donation_requests: donation_requests });
}
const show = async (req, res, next) => {
    const dr = await DonationRequest.findOne({ where: { id: req.params.id } });
    // res.send({ r: req.params.id });
    res.render('donation-request/show',
        {
            title: 'Donation Request #' + req.params.id,
            request: dr
        });
}

const create = async (req, res, next) => {
    // res.send('aaa')
    return res.render('donation-request/create', { title: 'Create Donation Request', layout: './layouts/signin', errors: [], donor: {} })
}
const store = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.render('donation-request/create', {
            title: 'Create Donation Request', layout: './layouts/signin',
            errors: result.array(), donor: req.body
        });

    }
    const donor = await Donor.findOne({ where: { national_id: req.body.national_id } });
    if (!donor) {
        // res.send('aaa')
        return res.redirect('/auth/donor/register');
    }
    const last_donation_request = await DonationRequest.findOne({ where: { donor_id: donor.national_id }, order: [['createdAt', 'DESC']] });
    if (last_donation_request && last_donation_request.status == "pending") {
        return res.render('donation-request/create',
            {
                title: 'Create Donation Request', layout: './layouts/signin',
                errors: [{ msg: "You already have a pending donation request" }],
                donor: donor
            });
    }
    const last_donation = await Donation.findOne({ where: { donor_id: donor.national_id }, order: [['createdAt', 'DESC']] });
    if (can_donate((new Date()).toISOString(), last_donation?.createdAt)) {
        await transport.sendMail({
            from: "no-reply@bbms.eg",
            to: donor.email,
            subject: "BBMS Donation Request Pending",
            html: "<h1>Thank you for your request</h1>"
                + "<h2>you donation is pending approval of virus test</h2>",
        });
        const dr = await DonationRequest.create({
            donor_id: donor.national_id,
            blood_type_id: donor.blood_type_id,
            status: "pending",
            test_result: "pending",
        });
        return res.redirect('/donation-request/' + dr.id + '/virus-test-result');
    }
    const next_donation_date = new Date(last_donation.createdAt);
    next_donation_date.setMonth(next_donation_date.getMonth() + 3);
    return res.render('donation-request/create', {
        title: 'Create Donation Request', layout: './layouts/signin',
        errors: [
            { msg: "You can't donate now.", },
            { msg: "You must wait 3 month from your last Donation" },
            { msg: "Your next donation date is " + next_donation_date.toDateString() }
        ],
        donor: donor
    });

}
const get_test_result = (req, res) => {
    // res.send('aaa')
    res.render('donation-request/virus-test',
        {
            title: 'Virus Test of #' + req.params.id,
            id: req.params.id
        });
}
const post_test_result = async (req, res) => {
    // res.send('aaa')
    const dr = await DonationRequest.findOne({ where: { id: req.params.id } });
    const lastDonation = await Donation.findOne({ where: { donor_id: dr.donor_id }, order: [['createdAt', 'DESC']] });
    const donor = await Donor.findOne({ where: { national_id: dr.donor_id } });
    if (req.body.test_result == 'negative' && can_donate(dr.createdAt, lastDonation?.createdAt)) {
        dr.status = "accepted";
        dr.test_result = req.body.test_result;
        await transport.sendMail({
            from: "no-reply@bbms.eg",
            to: donor.email,
            subject: "Donation Accepted",
            html: "<h1>Your Donation Request has been approved</h1>"
                + "<h2>Thanks for helping save lives </h2>",
        });
        const donation = await Donation.create({
            donor_id: donor.national_id,
            blood_type_id: donor.blood_type_id,
        });
        dr.donation_id = donation.id;
        // res.send({ donation: donation })
        await dr.save();
        return res.redirect('/donation-request');
    }
    dr.status = "rejected";
    await transport.sendMail({
        from: "no-reply@bbms.eg",
        to: donor.email,
        subject: "Donation Rejected",
        html: "<h1>Your Donation Request has been rejected</h1>"
            + "<h2 style='color :red;'>You must visit nearest hospital you have a dangerous virus </h2>",
    });
    dr.test_result = req.body.test_result;
    await dr.save();
    return res.redirect('/donation-request');
}

const can_donate = (donation_request_date, last_donation_date = null) => {
    const d = new Date(last_donation_date);
    d.setMonth(d.getMonth() + 3);
    const drDate = new Date(donation_request_date);
    return drDate > d;
}

module.exports = {
    index,
    show,
    create,
    store,
    get_test_result,
    post_test_result
};