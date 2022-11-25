require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

const app = express();

app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy({policy : "same-site" }));
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());




// app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "img-src": "*",
    },
  })
);

// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(helmet({ crossOriginOpenerPolicy: false }));

const authMiddleware = require("./middleware/auth.js");

const authRouter = require("./routes/auth.js");
const sauceRouter = require("./routes/sauces.js");

mongoose
  .connect(process.env.BDD, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((e) => console.log("mongo ok"))
  .catch((err) => {
    throw err;
  });

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

    if(req.method === 'OPTIONS') {
        return res.status(204);
    }
    next();
  });

app.use(
  "/public/images",
  express.static(path.join(__dirname, "public/images"))
);

app.use("/api/auth", authRouter);

app.use("/api/sauces", authMiddleware, sauceRouter);

module.exports = app;
