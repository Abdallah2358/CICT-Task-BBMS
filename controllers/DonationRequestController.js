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
    d = new Date(lastDonation?.createdAt || null);
    d.setMonth(d.getMonth() + 3);
    drDate = new Date(dr.createdAt);
    // res.send({ a:(req.body.test_result == 0 && drDate > d) });
    if (req.body.test_result == 0 && drDate > d) {
        const donor = await Donor.findOne({ where: { NID: dr.donor_id } });
        dr.status = "accepted";
        dr.test_result = req.body.test_result;
        await transport.sendMail({
            from: "no-reply@bbms.eg",
            to: donor.email,
            subject: "Donation Approved",
            html: "<h1>Your Donation Request has been approved</h1>"
                + "<h2>Thanks for helping save lives </h2>",
        });
        const donation = await Donation.create({
            donor_id: donor.NID,
            blood_type: donor.blood_type,
        });
        // res.send({ donation: donation })
        await dr.save();
        return res.redirect('/donation-request');
    }
    dr.status = "rejected";
    dr.test_result = req.body.test_result;
    await dr.save();
    return res.redirect('/donation-request');
}


module.exports = {
    index,
    show,
    get_test_result,
    post_test_result
};