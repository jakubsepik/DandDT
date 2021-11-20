const { ObjectId } = require("bson");
const express = require("express");

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

//env load
require("dotenv").config();

//This will help us connect to the database
const dbo = require("../db/conn");

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  //return next()
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = data.username;
    return next();
  } catch {
    return res.sendStatus(401);
  }
};

recordRoutes.route("/print").post((req, res) => {
  console.log(req.body);
  let db_connect = dbo.getDb("DandDT");
  db_connect.collection("data").insertOne({ epic: "lol" }, function (result) {
    console.log(result);
  });
  res.status(200).send("lol");
});

module.exports = recordRoutes;
