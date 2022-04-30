const User = require("../models/user.js");

const crypto = require('crypto')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const fn = require("./fn.js");


exports.signUp = async (req, res) => {
  try {
    await fn.validateInput(req.body.email, "string", "email is required")
    await fn.validateInput(req.body.password, "string", "password is required")
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    await user.save();
    res.status(201).json({ message: "user created" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.login = async (req, res) => {
  try {   
    await fn.validateInput(req.body.email, "string", "email is required")
    await fn.validateInput(req.body.password, "string", "password is required")
    requestedUser = await User.findOne({ email: req.body.email });

    if (!requestedUser) {
      return res.status(400).json({ error: "user not found" }); 
    }

    const authorize = await bcrypt.compare(
      req.body.password,
      requestedUser.password
    );

    if (!authorize) {
      return res.status(401).json({ error: "wrong password" });
    }

    res.status(200).json({
      userId: requestedUser._id,
      token: jwt.sign(
          {userId : requestedUser._id},
          crypto.createHash("sha256").update(process.env.TOKEN, "utf-8").digest("hex"),
          {expiresIn : "12h"}
          )
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
