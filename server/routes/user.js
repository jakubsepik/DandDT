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

const bcryptjs = require('bcryptjs');
const jwt = require("jsonwebtoken")
//verify token

recordRoutes.route("/verify").get((req, res) => {
  console.log("verify")
  if(!req.cookies.token){
    res.json({login:null})
  } else
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user=data.username;
    res.json({login:data.username})
  } catch {
    res.json({login:null})
  }
})


//login in and get token

recordRoutes.route("/login").post((req, res) => {
  let db_connect = dbo.getDb("DandDT")
  console.log("login")
  myquery = { email: req.body.email }
  db_connect.collection("login").findOne(myquery, async function (err, result) {
    if (err) throw err;
    if(result!=null)
    var compare = await bcryptjs.compare(req.body.password, result.password);
    else{
      res.send({
        login:null
      })
      return
    }
    if (compare) {
      username = result.username;
      token = jwt.sign({username: username }, process.env.TOKEN_SECRET, { expiresIn: '1d' })
      res.status(202).cookie('token',token,{expires: new Date(new Date().getTime()+24*60*60*1000),httpOnly:true,secure: false}).send({
        login:username
      });
    } else {
      res.send({
        login:null
      })
    }


  });
})

recordRoutes.route("/logout").get((req,res)=>{
  res.status(202).cookie('token',"", {expires: new Date(0)}).send({});
})

recordRoutes.route("/register").post((req, res) => {
  let db_connect = dbo.getDb("DandDT")
  console.log("register")
  myquery = {$or:[{"username":req.body.username},{"email":req.body.email}]}
  db_connect.collection("login").find(myquery,{ projection: { username: 1, email: 1} }).toArray((err,result)=>{
    if(result.length>0){
      if(result[0].email===req.body.email || result[1].email===req.body.email){
        res.send({status:"error",message:"That email is already registred"})
        return
      }
      if(result[0].username===req.body.username || result[1].username===req.body.username){
        res.send({status:"error",message:"That username is already registred"})
        return
      }
    }else{
      var password = bcryptjs.hash(req.body.password,10,(err,hash)=>{
        if(err)throw err
        db_connect.collection("login").insertOne({username:req.body.username,email:req.body.email,password:hash}).then((result)=>{
          res.json({status:"success"});
        })
      })
      
    }
  })
})







module.exports = recordRoutes;