const express = require('express');
const BRC = require('../controllers/BloodRequestController');
const db = require("../database/models");
const { checkSchema } = require('express-validator');
const router = express.Router();
router.use((req, res, next) => {
    if (!req.session.official) {
        // Store the previous URL in the session
        req.session.oldUrl = req.originalUrl;
        // req.session.official = db.HospitalOfficial.findOne({ where: { id: 1 } });
        // return res.redirect(req.originalUrl);
        return res.redirect('/hospital-officials/login');
    }
    next();
})
/* GET home page. */
router.get('/', BRC.index);

router.get('/create', BRC.create);
router.post('/create', checkSchema({
    patient_state: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Patient state is required'
    },
    blood_type_id: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'Blood type is required'
    },
    number: {
        in: ['body'],
        notEmpty: { errorMessage: 'Number is required' },
        isInt: { options: { min: 1 }, errorMessage: 'Number must be a positive integer' }
    },
}), BRC.store);
router.get('/edit', BRC.edit);
router.post('/edit', BRC.update);

router.get('/:id', BRC.show);


router.delete('/delete', BRC.deleteAction);

module.exports = router;