const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController');
const {  checkSchema} = require('express-validator');
const {registerDonorSchema} = require('../validators/auth/registerDonorSchema');
/* Get Register page. */
router.get('/donor/register', Auth.GetDonorsRegister);

/* Post Register Data */

router.post('/donor/register', checkSchema(registerDonorSchema) ,Auth.PostDonorsRegister);
module.exports = router;
