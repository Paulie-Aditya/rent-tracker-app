const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


// Tenant, Landlords
// Property → owned by landlords
// Lease → ties tenants & properties, holds rent info
// Payment → rent/refund transactions linked to leases
// Document → lease agreements, receipts, etc.
// Reminder → scheduled notifications

const Tenant = new Schema({
    firstName: String,
    lastName: String,
    phone: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String
})

const Landlord = new Schema({
    firstName: String,
    lastName: String,
    phone: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String
})

const Properties = new Schema({
    address: String,
    ownedBy: {type: ObjectId, ref: 'landlords'},
    amount: Number
})

const Lease = new Schema({
    owned_By: {type: ObjectId, ref: 'landlords'},
    agreedBy: [{type: ObjectId, ref: 'tenants'}], // can have multiple tenants,
    propertyId: {type: ObjectId, ref: 'properties'},
    startDate: Date,
    endDate: Date,
    monthlyRent: Number,
    dueDate: Number, // e.g. 1 = 1st of each month
    isActive: { type: Boolean, default: true },
})



const Payments = new Schema({
    leaseId: {type: ObjectId, ref: 'leases'},
    amount: Number,
    type: {type: String, enum: ["Rent", "Refund", "Deposit"]},
    paidBy: {type: ObjectId, ref: 'tenants'},
    paidTo: {type: ObjectId, ref: 'landlords'},
    transactionId: String,
    status: {type: String, enum: ["Pending", "Completed", "Failed"]}

})

const Reminders = new Schema({
    userId: {
        id: {type: ObjectId, required: true},
        role: {type: String, enum: ["TENANT", "LANDLORD"]}
    },  // depending on user id, we can customize the reminder
    leaseId: {type: ObjectId, ref: 'leases'},
    type: {type: String, enum:["PAYMENT_DUE", "DOCUMENT_EXPIRY"]},
    date: Date,
    isSent: {type: Boolean, default: false}
}, {timestamps: true})


const Document = new Schema({
    leaseId: {type: ObjectId, ref: 'leases'},
    uploadedBy: {
        id: {type: ObjectId, required: true},
        role: {type: String, enum: ["TENANT", "LANDLORD"]}
    },
    type: {type: String, enum: ["LEASE", "RECEIPT", "ID_PROOF", "NOTICE"]},
    url: String
}, {timestamps: true})


const TenantModel = mongoose.model('tenants', Tenant)
const LandlordModel = mongoose.model('landlords', Landlord)
const LeaseModel = mongoose.model('leases', Lease)
const PropertiesModel = mongoose.model('properties', Properties)
const PaymentModel = mongoose.model('payments', Payments)
const RemindersModel = mongoose.model('reminders', Reminders)
const DocumentModel = mongoose.model('documents', Document)


module.exports = {
    TenantModel: TenantModel,
    LandlordModel: LandlordModel,
    LeaseModel: LeaseModel,
    PropertiesModel: PropertiesModel,
    PaymentModel: PaymentModel,
    RemindersModel: RemindersModel,
    DocumentModel: DocumentModel,
}