const router = require('express').Router();
const { u } = require('tar');
const { jsonResponse } = require('../lib/jsonResponse');

router.post('/',(req, res) => {
    const {username, password} = req.body;

    if(!!!username || !!!password){

        return res.status(400).json(jsonResponse(400, {error: "fields are required"}));

    }

    const accessToken = "access-token";
    const refreshToken = "refresh-token";
    const user = {
        id: '1',
        name: 'John',
        username: 'johnzx',
    }


    
    res.status(200).json(jsonResponse(200, {user, accessToken, refreshToken}));
    
    res.send('signout');
});

module.exports = router;    

