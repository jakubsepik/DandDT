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

recordRoutes.route("/getFile").post((req, res) => {
  console.log("get file")
  console.log(req.body);
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .findOne({ _id: ObjectId(req.body.id) })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

recordRoutes.route("/updateFile").post((req, res) => {
  console.log("update")
  console.log(req.body);
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .updateOne({ _id: ObjectId(req.body.id) }, { $set: { body: req.body.body } })
    .then((result) => {
      res.status(200).json(result)
    });
});

recordRoutes.route("/getFiles").get((req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .find({}, { projection: { _id: 1, name: 1, tags: 1 } })
    .toArray((err, result) => {
      console.log(result);
      res.json(result);
    });
});
recordRoutes.route("/addFile").post((req, res) => {
  let db_connect = dbo.getDb("DandDT");
  console.log(req.body);
  db_connect
    .collection("data")
    .insertOne(req.body)
    .then((result) => {
      console.log(result);
      res.json(result.insertedId).status(200);
    });
});
module.exports = recordRoutes;
