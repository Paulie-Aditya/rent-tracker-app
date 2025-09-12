const express = require("express")
const Router = express.Router
const {z}  = require("zod")
const {LandlordModel} = require("../db")
const bcrypt= require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const landlordRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET


landlordRouter.post("/signup", async(req, res)=> {
    const requiredBody = z.object({
        email: z.email(),
        password: z.string(),
        firstName: z.string().min(3).max(100),
        lastName: z.string().max(100),
        phone: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        return res.send({
            message:"Incorrect format",
            error: parsedData.error
        })
    }

    try{
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        await LandlordModel.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: hashedPassword
        })

        return res.send({
            "message":"Landlord Signup Successful!"
        })
    }
    catch(err){
        return res.send({
            "message": "Internal Server error."
        })
    }
})

landlordRouter.post("/login", async(req, res) => {
    // can login using email for now only, will add other auth options + phone later

    const requiredBody = z.object({
        email: z.email(),
        password: z.string()
    })

    const parsedData = requiredBody.safeParse(req.body);
    if(!parsedData.success){
        return res.send({
            message:"Incorrect format",
            error: parsedData.error
        })
    }
    const email = req.body.email;

    try{
        const user = await LandlordModel.findOne({
            "email": email,
        })

        if(!user){
            throw new Error();
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isMatch){
            throw new Error();
        }
        
        const token = await jwt.sign({
            id: user._id,
            role_id: 1
        }, JWT_SECRET)

        return res.send({
            "message":"Logged in successfully!",
            "token":token
        })
    }
    catch(err){
        return res.send({
            "message":"Incorrect credentials"
        })
    }
})


module.exports = {
    landlordRouter
}