const express = require('express')
const router = express.Router()

const sauceCtrl = require("../controllers/sauce.js")
const multer = require("../middleware/multer.js")

// array of sauces 
router.get("/" , sauceCtrl.getAll)

// post a new sauce 
router.post("/" , multer.single('image') , sauceCtrl.newSauce)

// get id specific sauce 
router.get("/:id" , sauceCtrl.getSpecific)

// delete id specific sauce
router.delete("/:id")

// toggle array id like 
router.post("/:id/like")

module.exports= router