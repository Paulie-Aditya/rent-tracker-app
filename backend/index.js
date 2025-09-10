const express = require("express");
const { mongoose } = require("mongoose");
const dotenv = require("dotenv")

const app = express();
dotenv.config();
const DATABASE_URL = process.env.DATABASE_URL;

app.get("/", (req, res) => {
    res.send("Hello World")
})

async function main(){
    await mongoose.connect(DATABASE_URL);
    app.listen(3000, ()=>{
        console.log("Server is running")
    })
}

main()