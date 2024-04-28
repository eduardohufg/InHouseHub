const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');

router.post('/',(req, res) => {
    const {username, name, lastname,  password} = req.body;

    if(!!!username || !!!name || !!!lastname || !!!password){

        return res.status(400).json(jsonResponse(400, {error: "fields are required"}));

    }

    
    res.status(200).json(jsonResponse(200, {message: "User created"}));
    
    res.send('signout');
});

module.exports = router;    

