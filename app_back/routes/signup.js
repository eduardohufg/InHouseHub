const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('signup');
});

module.exports = router;    

