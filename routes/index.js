var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/* Get Register page. */
router.get('/register', function(req, res, next) {
  res.render('donors/register', { title: 'register',layout : './layouts/signin' });
});

module.exports = router;
