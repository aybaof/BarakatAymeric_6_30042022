const Sauce = require("../models/sauce.js")

const fn = require("./fn.js")

exports.getAll = (req , res) => {
    Sauce.find().then(sauces => res.status(200).json(sauces)).catch(err => res.status(400).json({err}))
}

exports.getSpecific = (req , res) => {
    Sauce.findOne({ _id : req.params.id}).then(sauce => res.status(200).json(sauce)).catch(err => res.status(404).json({err}))
}

exports.newSauce = async (req , res) => {
    const postSauce = JSON.parse(req.body.sauce)
    try {
        await fn.validateInput(req.body.sauce , "string" , "sauce name is required")
        const sauce = new Sauce({
            ...postSauce,
            imageUrl : `${req.protocol}://${req.get("host")}/public/images/${req.file.filename}`
        })
        await sauce.save()
        res.status(200).json({message : "sauce created"})
    } catch(err) {
        res.status(500).json({err})
    }
}