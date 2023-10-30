const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController');
const {  checkSchema} = require('express-validator');
const {registerSchema} = require('../validators/auth/registerSchema');
/* Get Register page. */
router.get('/register', Auth.GetDonorsRegister);

/* Post Register Data */

router.post('/register', checkSchema(registerSchema) ,Auth.PostDonorsRegister);
module.exports = router;
