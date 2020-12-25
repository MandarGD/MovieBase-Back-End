const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    verifyJwt: (req, res, next) => {
        const token = req.headers['x-access-token'];

        if(!token){
            res.json({auth: false, message: "No Token"});
            res.end();
        }
        else {
            jwt.verify(token, process.env.SECRET, (err, decode) => {
                if(err){
                    res.json({auth: false, message: "UnAuthorized"});
                    res.end();
                }
                else{
                    req.userId = decode.id;
                    next();
                }
            });
        }
    }
}