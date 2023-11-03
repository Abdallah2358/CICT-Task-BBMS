var express = require('express');
var router = express.Router();
const AdminController = require('../controllers/AdminController');
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Blood Banking Management System', layout: false , donor : req.session.donor });
});

router.get('/logout', function (req, res, next) {
  req.session.destroy();
  res.redirect('/');
});
router.get('/admin', AdminController.index);
router.get('/admin/login', AdminController.Login); 
router.post('/admin/login', AdminController.PostLogin); 
module.exports = router;
