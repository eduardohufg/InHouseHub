const { json } = require('express');

const router = require('express').Router();

router.route('/').get((req, res) => {
    res.status(200).json(jsonResponse(200, req.user));
});

module.exports = router;    

