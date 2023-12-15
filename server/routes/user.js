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

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');

//verify token
recordRoutes.route("/verify").get((req, res) => {
  if (!req.cookies.token) {
    res.json({ login: null });
  } else
    try {
      const data = jwt.verify(req.cookies.token, process.env.TOKEN_SECRET);
      req.user = data.username;
      res.json({ login: data.username });
    } catch {
      res.json({ login: null });
    }
});

//login in and get token

recordRoutes.route("/login").post((req, res) => {
  let db_connect = dbo.getDb("DandDT");
  //console.log("login");
  myquery = { email: req.body.email };
  db_connect.collection("login").findOne(myquery, async function (err, result) {
    if (err) throw err;
    if (result != null)
      var compare = await bcryptjs.compare(req.body.password, result.password);
    else {
      res.send({
        login: null,
      });
      return;
    }
    if (compare) {
      username = result.username;
      email = result.email;
      _id = result._id.toString();
      token = jwt.sign({ username: username, email: email, _id: _id }, process.env.TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(202)
        .cookie("token", token, {
          expires: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
          httpOnly: true,
          secure: false,
        })
        .send({
          login: username,
        });
    } else {
      res.send({
        login: null,
      });
    }
  });
});

recordRoutes.route("/logout").get((req, res) => {
  res
    .status(202)
    .cookie("token", "", { expires: new Date(0) })
    .send({});
});

recordRoutes.route("/register").post((req, res) => {
  let db_connect = dbo.getDb("DandDT");
  var body = req.body;

  if (
    !(
      body.password &&
      body.username &&
      body.email &&
      body.password.length >= 3 &&
      body.password.length <= 22 &&
      body.username.trim().length >= 3 &&
      body.username.trim().length <= 12
    )
  ) {
    res
      .status(400)
      .send({ message: "Wrong parameters. Refresh page and try again" });
    return;
  }
  req.body.username= req.body.username.trim()
  req.body.email= req.body.email.trim()

  myquery = {
    $or: [{ username: req.body.username }, { email: req.body.email }],
  };
  db_connect
    .collection("login")
    .find(myquery, { projection: { username: 1, email: 1 } })
    .toArray((err, result) => {
      if (result.length > 0) {
        if (
          result[0].email === req.body.email|| result[1] &&
          result[1].email === req.body.email
        ) {
          res.status(409).send({ message: "That email is already registred" });
          return;
        }
        if (
          result[0].username === req.body.username ||
          result[1].username === req.body.username
        ) {
          res
            .status(409)
            .send({ message: "That username is already registred" });
          return;
        }
      } else {
        var password = bcryptjs.hash(body.password, 10, (err, hash) => {
          if (err) {
            res
              .status(500)
              .send({ message: "Server error, contact administrator" });
            throw err;
          }
          db_connect
            .collection("login")
            .insertOne({
              username: body.username,
              email: body.email,
              password: hash,
              selectionTree: [],
            })
            .then((result) => {
              res.json({ message: "Registration successful", _id: result });
            });
        });
      }
    });
});

recordRoutes.route("/resetPassword").post((req,res)=>{
  if(!req.body.email){
    res.status(400).json({message:"Wrong or missing email"})
    return
  }
  let db_connect = dbo.getDb("DandDT");
  db_connect.collection("login").findOne({email:req.body.email},{projection:{resetTimestamp:1}}).then((result)=>{
    const now = new Date();
    const diffInMs = now - result.resetTimestamp;
    if(result.timestamp==0 || diffInMs>=28800000){
      res.status(200).json({message:"The system has sent a password reset email, check your inbox"})
      result
    }
  }).catch((err)=>{
    res.status(500).send()
    return
  })

  let token = crypto.randomBytes(32).toString("hex")
  let timestamp = new Date()
  db_connect.collection("login").updateOne({email:req.body.email},{$set:{resetToken:token,resetTimestamp:timestamp}}).catch((err)=>{
    res.status(500)
  }).then((result)=>{
    res.status(200).send(result)
  })
})

module.exports = recordRoutes;
