const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://aybaof974:m3CZCpGTFiE66XW@hottakes.0olnw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority' , {
    useNewUrlParser : true,
    useUnifiedTopology : true
}).then(() => console.log("mongoDB ok")).catch(() => console.log("mongoDB not ok"));

const app = express()

app.use((req,res) => {
    
})

module.exports = app