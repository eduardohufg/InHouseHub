const router = require('express').Router();

router.route('/').get((req, res) => {
    res.send('todos');
});

module.exports = router;    

