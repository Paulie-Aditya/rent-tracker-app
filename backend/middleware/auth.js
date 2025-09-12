const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET

async function landlordAuth(req, res, next){
    const token = req.headers.authorization;
    try{
        const user = await jwt.verify(token, JWT_SECRET);

        if(!user){
            throw new Error();
        }

        if(user.role_id != 1){
            throw new Error();
        }

        req.id = user.id;
        next();
    }
    catch(err){
        return res.status(401).send({
            "message":"Unauthorized"
        })
    }
}


async function tenantAuth(req, res, next){
    const token = req.headers.authorization;
    try{
        const user = await jwt.verify(token, JWT_SECRET);

        if(!user){
            throw new Error();
        }

        if(user.role_id != 2){
            throw new Error();
        }

        req.id = user.id;
        next();
    }
    catch(err){
        return res.status(401).send({
            "message":"Unauthorized"
        })
    }
}

async function isAuthenticated(req, res, next){
    const token = req.headers.authorization;
    try{
        const user = await jwt.verify(token, JWT_SECRET);

        if(!user){
            throw new Error();
        }
        req.id = user.id;
        req.role_id = user.role_id
        next();
    }
    catch(err){
        return res.status(401).send({
            "message":"Unauthorized"
        })
    }
}

module.exports = {
    tenantAuth: tenantAuth,
    landlordAuth: landlordAuth,
    isAuthenticated: isAuthenticated
}