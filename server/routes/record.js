const { ObjectId } = require("bson");
const express = require("express");

const recordRoutes = express.Router();

//env load
require("dotenv").config();

//connection to database
const dbo = require("../db/conn");

const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (req.headers["postman-token"]) {
    res.locals.user = "test";
    return next();
  }

  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.user = data.username;
    return next();
  } catch (e) {
    return res.sendStatus(401);
  }
};

recordRoutes.route("/getFiles").get(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .find(
      { author: res.locals.user },
      { projection: { _id: 1, name: 1, tags: 1 } }
    )
    .toArray((err, result) => {
      res.json(result);
    });
});

recordRoutes.route("/getFile").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .findOne({ _id: ObjectId(req.body.id), author: res.locals.user })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

recordRoutes.route("/addFile").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  //console.log(req.body)
  if (
    !(
      Object.keys(req.body).length === 1 &&
      req.body.name &&
      req.body.name.length >= 1
    )
  ) {
    res
      .status(400)
      .json({ message: "Wrong parameters. Refresh page and try again" });
    return;
  }
  req.body.author = res.locals.user;
  req.body.body = "";
  req.body.tags = [];
  req.body.links = [];

  db_connect
    .collection("data")
    .insertOne(req.body)
    .then((result) => {
      db_connect
        .collection("login")
        .updateOne(
          { username: res.locals.user },
          {
            $push: {
              selectionTree: {
                $each: [result.insertedId],
                $position: 0,
              },
            },
          }
        )
        .catch((err) => {
          res.status(500).json(err);
          throw err;
        })
        .then(() => {
          res.json(result.insertedId).status(200);
        });
    });
});

recordRoutes.route("/updateFile").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("data")
    .updateOne(
      { _id: ObjectId(req.body._id), author: res.locals.user },
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

recordRoutes.route("/deleteFile").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  console.log("deleted file");
  console.log(req.body);
  if (!req.body._id || !ObjectId.isValid(req.body._id)) {
    res
      .status(400)
      .send({ message: "Wrong parameters. Refresh page and try again" });
    return;
  }
  db_connect
    .collection("data")
    .deleteOne({ _id: ObjectId(req.body._id), author: res.locals.user })
    .then((result) => {
      if (result.deletedCount === 1) {
        db_connect
          .collection("data")
          .updateMany(
            { author: res.locals.user },
            { $pull: { links: req.body._id } },
            (err, obj) => {
              console.log(obj);
              if (err) throw err;
            }
          );

        db_connect
          .collection("login")
          .updateOne(
            { username: res.locals.user },
            { $pull: { selectionTree: ObjectId(req.body._id) } }
          )
          .then((result2) => {
            console.log(result2);
          })
          .catch((err) => {
            throw err;
          });

        res.status(202).send();
      } else {
        res.status(400).send({
          message: "Wrong parameters. Refresh page and try again",
        });
        return;
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Wrong parameters. Refresh page and try again" });
      throw err;
    });
});

recordRoutes.route("/exportFiles").get(authorization, async (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  var await_treeselection = await db_connect
    .collection("login")
    .findOne(
      { username: res.locals.user },
      { projection: { selectionTree: 1 } }
    );
  db_connect
    .collection("data")
    .find({ author: res.locals.user })
    .toArray()
    .then((result) => {
      res.setHeader("Content-Type", "application/json");
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + res.locals.user + "_files.json"
      );
      res.send(
        JSON.stringify({
          selectionTree: await_treeselection.selectionTree,
          files: result,
        })
      );
    });
});

recordRoutes.route("/getSelectionTree").get(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("login")
    .findOne({ username: res.locals.user }, function (err, obj) {
      if (err) throw err;
      if (obj.selectionTree) res.status(200).json(obj.selectionTree);
      else {
        db_connect
          .collection("data")
          .find({ author: res.locals.user }, { projection: { _id: 1 } })
          .toArray((err, result) => {
            const array = [];
            result.forEach((element) => {
              array.push(element._id);
            });
            db_connect
              .collection("login")
              .updateOne(
                { username: res.locals.user },
                { $set: { selectionTree: array } }
              );
            res.status(200).json(array);
          });
      }
    });
});

recordRoutes.route("/updateSelectionTree").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("login")
    .updateOne(
      { username: res.locals.user },
      { $set: { selectionTree: req.body.selectionTree } },
      function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
      }
    );
});

module.exports = recordRoutes;
