const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController');
const { checkSchema } = require('express-validator');
const { registerSchema: registerDonorSchema } = require('../validators/donor/registerSchema');

module.exports = router;
