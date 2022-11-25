const jwt = require("jsonwebtoken");
const crypto = require("crypto");

module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(
        token,
        crypto
          .createHash("sha256")
          .update(process.env.TOKEN, "utf-8")
          .digest("hex")
      );
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !== userId) {
        throw "Un probléme est survenu";
      }
      req.userId = userId;
      next();
    } catch (err) {
      res.status(401).json({ error: new Error("Invalid request") });
    }
};
