const express = require('express');
const router = express.Router();
const DC = require('../controllers/DonorController');
const { checkSchema } = require('express-validator');
const { registerSchema: registerDonorSchema } = require('../validators/donor/registerSchema');
/* Get Register page. */
router.get('/register', DC.Register);

/* Post Register Data */
router.post('/register',
  checkSchema(registerDonorSchema),
  DC.PostRegister);
module.exports = router;
