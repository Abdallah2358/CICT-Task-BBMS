const express = require('express');
const router = express.Router();
const DRC = require('../controllers/DonationRequestController');
const { checkSchema } = require('express-validator');
router.use('/create', (req, res, next) => {
    if (!req.session.donor) {
        // Store the previous URL in the session
        req.session.oldUrl = req.originalUrl;
        return res.redirect('/donors/login');
    }
    return next()
});
router.use('/', (req, res, next) => {
    if (!req.session.admin) {
        // Store the previous URL in the session
        req.session.oldUrl = req.originalUrl;
        return res.redirect('/admin/login');
    }
    return next()
});

router.get('/create', DRC.create);
router.post('/create', checkSchema(
    {
        national_id: {
            in: ['body'],
            errorMessage: 'National Id is required',
            isInt: true,
            isLength: {
                options: { min: 9, max: 9 },
                errorMessage: 'National Id must be 9 digits'
            }
        }
    }
), DRC.store);
/* Get Register page. */
router.get('/', DRC.index);
router.get('/:id', DRC.show);
router.get('/:id/virus-test-result', DRC.get_test_result);
router.post('/:id/virus-test-result', DRC.post_test_result);


module.exports = router;
