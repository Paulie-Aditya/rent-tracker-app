const express = require("express")
const Router = express.Router
const {isAuthenticated, landlordAuth} = require("../middleware/auth")
const { LeaseModel, PropertiesModel } = require("../db")

const leaseRouter = Router()

leaseRouter.get("/", isAuthenticated, async(req, res)=> {
    if(req.role_id === 1){
        // landlord
        try{
            const leases = await LeaseModel.find({
                owned_By:req.id,
                isActive: true
            })

            return res.send(leases)
        }
        catch(err){
            res.send({
                "message":"Internal Server Error"
            })
        }
    }
    else if(req.role_id === 2){
        // tenant
        try{
            const leases = await LeaseModel.find({
                agreedBy: req.id
            })
            return res.send(leases)
        }
        catch(err){
            res.send({
                "message":"Internal Server Error"
            })
        }
    }
})

leaseRouter.post("/create", landlordAuth, async(req, res)=>{
    try{
        const {propertyId, agreedBy, startDate, endDate, monthlyRent, dueDate, isActive} = req.body
        const owned_By = req.id
        await LeaseModel.create({
            propertyId: propertyId,
            agreedBy: agreedBy,
            owned_By: owned_By,
            startDate: startDate,
            dueDate: dueDate,
            endDate: endDate,
            monthlyRent: monthlyRent,
            isActive: isActive
        })
        res.send({
            "message":"Property listed successfully!"
        })
    }
    catch(err){
        res.send({
            "message":"Internal Server Error"
        })
    }
    
})

leaseRouter.put("/update", landlordAuth, async(req, res)=>{
    try{
        const {propertyId, agreedBy, startDate, endDate, monthlyRent, dueDate, isActive} = req.body
        const owned_By = req.id
        const lease = await LeaseModel.findOne({
            propertyId: propertyId,
            owned_By: owned_By,
        })

        lease.agreedBy = agreedBy;
        lease.startDate= startDate;
        lease.dueDate= dueDate;
        lease.endDate= endDate;
        lease.monthlyRent= monthlyRent;
        lease.isActive= isActive
        lease.save();

        res.send({
            "message":"Property updated successfully!"
        })
    }
    catch(err){
        res.send({
            "message":"Internal Server Error"
        })
    }
    
})

leaseRouter.post("/delete", landlordAuth, async(req, res)=> {
    try{
        await PropertiesModel.deleteOne({
            ownedBy: req.id,
            propertyId: req.body.propertyId
        });
        res.send({
            "message" : "Property deleted succesfully!"
        })
    }
    catch(err){
        res.send({
            "message":"Internal Server Error"
        })
    }
})