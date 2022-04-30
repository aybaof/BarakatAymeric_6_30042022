require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');

const app = express()

const auth = require("./middleware/auth.js")
const authRouter = require('./routes/auth.js');


mongoose.connect(process.env.BDD , {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(e => console.log("mongo ok")).catch((err) =>{ throw err} );

app.use("/api/auth" , authRouter);







module.exports = app