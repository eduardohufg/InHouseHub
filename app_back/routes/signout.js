const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('signout');
});

module.exports = router;    

