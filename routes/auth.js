const express = require('express');
const router = express.Router();
const Auth = require('../controllers/AuthController');

/* Get Register page. */
router.get('/register', Auth.GetRegister);

/* Post Register Data */

router.post('/register', Auth.PostRegister);
module.exports = router;
