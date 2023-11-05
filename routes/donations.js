const express = require('express');
const DC = require('../controllers/DonationController');
const router = express.Router();

router.use('/', (req, res, next) => {
    if (!req.session.admin) {
        // Store the previous URL in the session
        req.session.oldUrl = req.originalUrl;
        return res.redirect('/admin/login');
    }
    return next()
});
/* GET home page. */
router.get('/', DC.index);
router.get('/:id', DC.show);

router.get('/create', DC.create);
router.get('/edit', DC.edit);


router.post('/store', DC.store);
router.post('/update', DC.update);

router.delete('/delete', DC.deleteAction);

module.exports = router;