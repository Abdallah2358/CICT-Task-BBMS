const db = require('../database/models');
const config = require('../config');
const { validationResult } = require('express-validator');

const BloodTypes = config.Blood_types;
const BloodRequest = db.BloodRequest;
const HospitalOfficial = db.HospitalOfficial;
// returns list view of resource
const index = async (req, res, next) => {
    const official = req.session.official;
    if (!official) {
        return res.redirect('/hospital-officials/login');
    }
    const requests = await BloodRequest
        .findAll({
            where: { hospital_id: official.hospital_id },
            include: ['blood_type', 'city'],
            order: [['fulfilled','DESC'],['patient_state', 'ASC'], ['createdAt', 'DESC']]
        });
    return res.render(
        'blood-requests/index',
        { title: 'Blood Requests', requests: requests }
    );
}

// returns single view of a resource
const show = async (req, res, next) => {
    const blood_types = await BloodTypes;
    return res.render('blood-request/show', { title: 'Blood Request', blood_types });
}

// returns create view for a resource
const create = async (req, res, next) => {
    const blood_types = await BloodTypes;
    return res.render('blood-requests/create',
        {
            title: 'Create Blood Request',
            blood_types,
            request: {},
            states: ['Immediate', 'Urgent', 'Normal'],
            errors: []
        });
}

// handles priesting the resource in the database
// may redirect to another action or return the status with errors if any 
const store = async (req, res, next) => {
    // return res.send('store');
    const result = validationResult(req);
    const blood_types = await BloodTypes;
    const { patient_state, blood_type_id, number } = req.body;
    const official = req.session.official;
    const hospital = await db.Hospital.findOne({ where: { id: official.hospital_id }, include: ['city'] });
    const request = { number, patient_state, blood_type_id, city_id: hospital.city.id, hospital_id: official.hospital_id };

    if (!result.isEmpty()) {
        // return res.send(request);
        return res.render('blood-requests/create',
            {
                title: 'Create Blood Request',
                blood_types,
                request: request,
                states: ['Immediate', 'Urgent', 'Normal'],
                errors: result.array()
            });
    }
    for (let i = 0; i < number; i++) {
        const blood_request = BloodRequest.build(request);
        blood_request.save();
    }
    return res.redirect('/blood-requests');

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