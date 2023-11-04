const express = require('express');
const BRC = require('../controllers/BloodRequestController');

const router = express.Router();

/* GET home page. */
router.get('/', BRC.index);
router.get('/:id', BRC.show);

router.get('/create', BRC.create);
router.get('/edit', BRC.edit);


router.post('/store', BRC.store);
router.post('/update', BRC.update);

router.delete('/delete', BRC.deleteAction);

module.exports = router;