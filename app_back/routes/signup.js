const router = require('express').Router();
const { jsonResponse } = require('../lib/jsonResponse');
const User = require('../schema/user');

router.post('/', async(req, res) => {
    const {username, name, lastname,  password} = req.body;

    if(!!!username || !!!name || !!!lastname || !!!password){

        return res.status(400).json(jsonResponse(400, {error: "fields are required"}));

        
    }

    try{
        const user = new User();
        const exist = await user.usernameExists(username);


    if(exist){
        return res.status(400).json(jsonResponse(400, {error: "username already exists"}));
    }
    
    const newuser = new User({
        username,
        name,
        lastname,
        password,
    });



    await newuser.save();

    
    res.status(200).json(jsonResponse(200, {message: "User created"}));
    
    //res.send('signout');

    }
    
    catch(e){
        res.status(500).json(jsonResponse(500, {error: "Error creating user"}));
    }

    
});

module.exports = router;    

