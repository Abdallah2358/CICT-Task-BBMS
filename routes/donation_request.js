const express = require('express');
const router = express.Router();
const DRC = require('../controllers/DonationRequestController');
const { checkSchema } = require('express-validator');
/* Get Register page. */
router.get('/', DRC.index);
router.get('/create', DRC.create);
router.post('/create', checkSchema(
    {
        NID: {
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

router.get('/:id', DRC.show);
router.get('/:id/virus-test-result', DRC.get_test_result);
router.post('/:id/virus-test-result', DRC.post_test_result);

/* Post Register Data */

// router.post('/donor/register',
//     checkSchema(registerDonorSchema),
//     DRC.PostDonorsRegister);
module.exports = router;
