require('dotenv').config()

const path = require('path')
const express = require('express');
const mongoose = require('mongoose');

const app = express()

const authMiddleware = require("./middleware/auth.js");

const authRouter = require('./routes/auth.js');
const sauceRouter = require("./routes/sauces.js");


mongoose.connect(process.env.BDD , {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(e => console.log("mongo ok")).catch((err) =>{ throw err} );

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/public/images' , express.static(path.join(__dirname , 'public/images')))

app.use("/api/auth" , authRouter);

app.use("/api/sauces" , authMiddleware ,sauceRouter)








module.exports = app