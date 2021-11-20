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

//verify token
const jwt = require("jsonwebtoken")
recordRoutes.route("/verify").get((req, res) => {
  if(!req.cookies.token){
    res.json({login:false})
  } else
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user=data.username;
    res.json({login:true})
  } catch {
    res.json({login:false})
  }
})

recordRoutes.route("/ez").get((req,res)=>{
    res.json({lol:"lol"})
})


//login in and get token

recordRoutes.route("/login").post((req, res) => {
  const bcryptjs = require('bcryptjs');
  let db_connect = dbo.getDb("login")
  console.log("login")
  myquery = { username: req.body.username }
  db_connect.collection("data").findOne(myquery, async function (err, result) {
    if (err) throw err;
    var result = await bcryptjs.compare(req.body.password, result.password);
    if (result) {
      username = req.body.username;
      token = jwt.sign({username: username }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
      res.status(202).cookie('token',token,{expires: new Date(new Date().getTime()+24*60*60*1000),httpOnly:true,secure: false}).send({
        login:true
      });
    } else {
      res.send({
        login:false
      })
    }


  });
})







module.exports = recordRoutes;