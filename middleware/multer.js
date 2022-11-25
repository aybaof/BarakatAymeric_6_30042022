const multer = require('multer')
const fs = require("fs")
const path = require("path")

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
        let name = Date.now() + file.originalname.replace(" ", "_")
        const isExtensionOk = MIME_TYPE[file.mimetype] ? true : false;
        if(!isExtensionOk) return callback(new Error("Invalid extension") , null)
        while(fs.existsSync(path.join( "../public/image/" , name))){
            name = Date.now() + file.originalname.replace(" " , "_")
        }
        callback(null, name);
        
    }
})

module.exports = multer({storage : storage})