const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('refreshToken');
});

module.exports = router;    
