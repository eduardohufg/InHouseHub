const router = require('express').Router();
const { u } = require('tar');
const { jsonResponse } = require('../lib/jsonResponse');
const User = require('../schema/user');
const { getUserinfo } = require("../lib/getUserinfo");


router.post('/', async (req, res) => {
    const {username, password} = req.body;

    if(!!!username || !!!password){

        return res.status(400).json(jsonResponse(400, {error: "fields are required"}));

    }

    const user =await  User.findOne({username });

    if(!user){
        return res.status(400).json(jsonResponse(400, {error: "user not found"}));
    }
    else{
        const correctPassword = await user.comparePassword(password, user.password);
        if(correctPassword){
            const accessToken = user.createAccessToken();
            const refreshToken = await user.createRefreshToken();
    
            res.status(200).json(jsonResponse(200, {user: getUserinfo(user), accessToken, refreshToken}));
            
        }
        else{
            return res.status(400).json(jsonResponse(400, {error: "user or password not found"}));
        }
    }

 
  
});

module.exports = router;    

