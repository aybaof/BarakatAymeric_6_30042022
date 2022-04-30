const mongoose = require('mongoose')

const sauce = mongoose.Schema({
    userId : {type : String , required : true},
    name : {type : String , required : true},
    manufacturer : {type : String},
    description : {type : String , required : true},
    mainPepper : {type : String , required : true},
    imageUrl : {type : String , required : true},
    heat : {type : Number , required : true},
    likes : {type : Number},
    dislikes : {type : String},
    usersLiked : {type : String},
    usersDisliked : {type : [String]},
})