var express = require('express');
const TRC = require('../controllers/TemplateController');

var router = express.Router();

/* GET home page. */
router.get('/', TRC.index);
router.get('/:id', TRC.show);

router.get('/create', TRC.create);
router.get('/edit', TRC.edit);


router.post('/store', TRC.store);
router.post('/update', TRC.update);
router.delete('/delete', TRC.deleteAction);


module.exports = router;
