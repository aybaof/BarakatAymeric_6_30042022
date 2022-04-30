const crypto = require("crypto");

const moduleFunction = {
  hashSha256: (str) =>
    crypto.createHash("sha256").update(str, "utf-8").digest("hex"),

  typeRequest: (req) => {
    return new Promise((resolve, reject) => {
      typeof req.body.email === "String" && req.body.email.length > 0
        ? null
        : reject({ error: "email is required" });
      typeof req.body.password === "String" && req.body.password.length > 0
        ? resolve()
        : reject({ error: "password is required" });
    });
  },
};

module.exports = moduleFunction;
