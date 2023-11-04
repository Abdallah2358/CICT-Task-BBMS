const express = require('express');
const HOC = require('../controllers/HospitalOfficialController');

const router = express.Router();

router.get('/login', HOC.Login);
router.post('/login', HOC.PostLogin);
/* GET home page. */
router.get('/', HOC.index);
router.get('/:id', HOC.show);

router.get('/create', HOC.create);
router.get('/edit', HOC.edit);


router.post('/store', HOC.store);
router.post('/update', HOC.update);

router.delete('/delete', HOC.deleteAction);

module.exports = router;