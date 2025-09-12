const express = require("express")
const Router = express.Router;
const {tenantAuth, landlordAuth} = require("../middleware/auth")
const {PropertiesModel} = require("../db")
const { z } = require("zod")

const propertyRouter = Router();


propertyRouter.get("/", async(req, res)=>{
    try{
        const properties = await PropertiesModel.find();
        return res.send(properties)
    }
    catch(err){
        console.log(err)
        res.status(500).send({
            "message":"Internal Server Error"
        })
    }
})

propertyRouter.post("/create", landlordAuth, async(req, res) => {
    try{
        const requiredBody = z.object({
            address: z.string(),
            amount: z.number()
        })

        const parsedData = requiredBody.safeParse(req.body);
        if(!parsedData.success){
            throw new Error();
        }

        await PropertiesModel.create({
            address: req.body.address,
            amount: req.body.amount,
            ownedBy: req.id
        })
        res.send({
            "message":"Property created successfully!"
        })
    }
    catch(err){
        res.status(500).send({
            "message":"Internal Server error"
        })
    }
})

propertyRouter.post("/delete", landlordAuth, async(req, res) => {
    try{
        // just need to send property id
        await PropertiesModel.deleteOne({
            _id: req.body.propertyId
        })
        res.send({
            "message":"Property deleted successfully!"
        })
    }
    catch(err){
        res.status(500).send({
            "message":"Internal Server error"
        })
    }
})


module.exports = {
    propertyRouter
}