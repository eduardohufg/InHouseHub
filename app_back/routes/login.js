const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('login');
});

module.exports = router;    

