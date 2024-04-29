const { verify } = require('jsonwebtoken');
const getTokenFromHeader = require('../auth/getTokenFromHeader');   
const {jsonResponse} = require('../lib/jsonResponse');
const Token = require('../schema/token');
const { verifyRefreshTokens } = require('../lib/verifyTokens');
const { generateAccessToken } = require('../auth/generateTokens');

const router = require('express').Router();

router.post('/', async (req, res) => {
    const refreshToken = getTokenFromHeader(req.headers);

    if(refreshToken){

        try {
            const found = await Token.findOne({token: refreshToken});
            if(!found){
                return res.status(401).send(jsonResponse(401, {error: "unauthorized"}));
            }
            const payload = verifyRefreshTokens(found.token);
            if(payload){
                const accessToken = generateAccessToken(payload.user);

                return res.status(200).json(jsonResponse(200, {accessToken}));
            }else{
                return res.status(401).send(jsonResponse(401, {error: "unauthorized"}));
            }

            
        } catch (error) {
            return res.status(401).send(jsonResponse(401, {error: "unauthorized"}));
            
        }


    }else{
        res.status(401).send(jsonResponse(401, {error: "unauthorized"}));
    }
    res.send('refreshToken');
});

module.exports = router;    

