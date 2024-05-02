
const { verifyAccessTokens } = require("../lib/verifyTokens");
const getTokenFromHeader = require("./getTokenFromHeader");
const { jsonResponse } = require("../lib/jsonResponse");



function aunten(req, res, next) {
    const token = getTokenFromHeader(req.headers);

    if(token){
        const decode = verifyAccessTokens(token);
        if(decode){

            req.user = { ...decode.user };
            next();
        }
        else{
            res.status(401).json(jsonResponse(401, {error: "unauthorized"})); 
        }
    }
    else{
        res.status(401).json(jsonResponse(401, {error: "unauthorized"}));
    }
}

module.exports = aunten;