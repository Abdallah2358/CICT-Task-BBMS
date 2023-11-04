const express = require('express');
const DC = require('../controllers/DonationController');
const router = express.Router();

/* GET home page. */
router.get('/', DC.index);
router.get('/:id', DC.show);

router.get('/create', DC.create);
router.get('/edit', DC.edit);


router.post('/store', DC.store);
router.post('/update', DC.update);

router.delete('/delete', DC.deleteAction);

module.exports = router;