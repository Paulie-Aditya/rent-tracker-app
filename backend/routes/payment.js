const express = require("express")
const Router = express.Router
const {PaymentModel} = require("../db")


const paymentRouter = Router()


paymentRouter.post("/", async(req, res)=> {
    // needs to be hit by dodo payments  ?
    try{
        const {leaseId, amount, type, paidBy, paidTo, transactionId, status} = req.body
        await PaymentModel.create({
            leaseId: leaseId,
            amount: amount,
            type: type,
            paidBy: paidBy,
            paidTo: paidTo,
            transactionId: transactionId,
            status: status
        })
    }
    catch(err){
        res.send({
            "message":"Internal Server Error"
        })
    }
})

module.exports = {
    paymentRouter
}