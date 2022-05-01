const { reject } = require("bcrypt/promises")
const fs = require("fs")
const path = require ("path")

exports.validateInput = (input, type ,errorMsg) => {
    return new Promise((resolve , reject) => {
        typeof(input) === type ? resolve() : reject({error: errorMsg})
      })
}

exports.deleteImage = (url) => {
  url = url.split("/images/")[1]
  return new Promise((resolve, reject) => {
    fs.unlink(path.resolve(__dirname, "..", "public", "images", url), err => {
      if (err) reject(err);
      resolve();
    });
  })
}