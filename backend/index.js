const express = require("express");
const { mongoose } = require("mongoose");
const dotenv = require("dotenv")
const { tenantRouter } = require("./routes/tenant")
const { landlordRouter } = require("./routes/landlord")
const { propertyRouter } = require("./routes/properties")
const db = require("./db")


const app = express();
app.use(express.json())
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

app.get("/", (req, res) => {
    res.send("Hello World")
})

app.use("/tenant", tenantRouter)
app.use("/landlord", landlordRouter)
app.use("/properties", propertyRouter)

async function main(){
    await mongoose.connect(DATABASE_URL);
    app.listen(3000, ()=>{
        console.log("Server is running")
    })
}

main()