const multer = require('multer')

const MIME_TYPE = {
    "image/png" : "png",
    "image/jpeg" : "jpg",
    "image/jpg" : "jpg"
}

const storage = multer.diskStorage({
    destination : (req , file , callback) => {
        callback(null , 'public/images')
    },
    filename : (req , file , callback) => {
        const name = file.originalname.replace(" ", "_")
        callback(null, Date.now() + name)
    }
})

module.exports = multer({storage : storage})