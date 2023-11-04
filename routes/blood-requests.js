const express = require('express');
const BRC = require('../controllers/BloodRequestController');

const router = express.Router();
router.use((req, res, next) => {
    if (!req.session.official) {
        // Store the previous URL in the session
        req.session.oldUrl = req.originalUrl;
        return res.redirect('/hospital-officials/login');
    }
    next();
})
/* GET home page. */
router.get('/', BRC.index);

router.get('/create', BRC.create);
router.get('/edit', BRC.edit);

router.get('/:id', BRC.show);

router.post('/store', BRC.store);
router.post('/update', BRC.update);

router.delete('/delete', BRC.deleteAction);

module.exports = router;