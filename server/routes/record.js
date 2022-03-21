const { ObjectId } = require("bson");
const express = require("express");

const recordRoutes = express.Router();

//env load
require("dotenv").config();

//connection to database
const dbo = require("../db/conn");

const jwt = require("jsonwebtoken")

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.user = data.username;
    return next();
  } catch(e) {
    return res.sendStatus(401);
  }
};

recordRoutes.route("/getFile").post(authorization,(req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .findOne({ _id: ObjectId(req.body.id), author:res.locals.user })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

recordRoutes.route("/updateFile").post(authorization,(req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .updateOne(
      { _id: ObjectId(req.body._id),author:res.locals.user },
      {
        $set: {
          body: req.body.body,
          name: req.body.name,
          tags: req.body.tags,
          links: req.body.links,
        },
      }
    )
    .then((result) => {
      res.status(200).json(result);
    });
});

recordRoutes.route("/getFiles").get(authorization,(req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .find({author:res.locals.user}, { projection: { _id: 1, name: 1, tags: 1 } }).sort({name:1})
    .toArray((err, result) => {
      res.json(result);
    });
});
recordRoutes.route("/addFile").post(authorization,(req, res) => {
  let db_connect = dbo.getDb("DandDT");
  req.body.author=res.locals.user
  db_connect
    .collection("data")
    .insertOne(req.body)
    .then((result) => {
      res.json(result.insertedId).status(200);
    });
});
recordRoutes.route("/deleteFile").post(authorization,(req, res) => {
  let db_connect = dbo.getDb("DandDT");
  console.log("deleted file")
  console.log(req.body)
  db_connect
    .collection("data").deleteOne({_id:ObjectId(req.body.id),author:res.locals.user },function(err,obj){
      if(err) throw err
    })
  db_connect.collection("data").updateMany({author:res.locals.user },{$pull:{links:req.body.id}},(err,obj)=>{
    if(err)throw err
    res.status(200).json({})
  })
});
module.exports = recordRoutes;
