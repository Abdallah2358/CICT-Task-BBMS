const express = require('express');
const router = express.Router();
const DRC = require('../controllers/DonationRequestController');
const { checkSchema } = require('express-validator');
/* Get Register page. */
router.get('/', DRC.index);

router.get('/:id', DRC.show);
router.get('/:id/virus-test-result', DRC.get_test_result);
router.post('/:id/virus-test-result', DRC.post_test_result);

/* Post Register Data */

// router.post('/donor/register',
//     checkSchema(registerDonorSchema),
//     DRC.PostDonorsRegister);
module.exports = router;
