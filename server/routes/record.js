const { ObjectId } = require("bson");
const express = require("express");

const recordRoutes = express.Router();

//env load
require("dotenv").config();

//connection to database
const dbo = require("../db/conn");

//web token for authentication
const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const token = req.cookies.token;
  if (req.headers["postman-token"] && process.env.MODE == "DEVELOPMENT") {
    res.locals.user = "test";
    return next();
  }

  if (!token) {
    return res.sendStatus(401);
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_SECRET);
    res.locals.user = data.username;
    res.locals.email = data.email;
    res.locals._id = data._id;
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
      { author: res.locals._id },
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
    .findOne({ _id: ObjectId(req.body.id), author: res.locals._id })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

recordRoutes.route("/addFile").post(authorization, (req, res) => {
  let db_connect = dbo.getDb("DandDT");
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
  req.body.authorName = res.locals.user;
  req.body.author = res.locals._id;
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
          { _id: ObjectId(res.locals._id) },
          {
            $push: {
              selectionTree: {
                $each: [result.insertedId.toString()],
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
      { _id: ObjectId(req.body._id), author: res.locals._id },
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

  let output = 0;

  db_connect
    .collection("login")
    .updateOne(
      { _id: ObjectId(res.locals._id) },
      { $pull: { selectionTree: req.body._id } }
    )
    .then((result2) => {
      output = 1;
    })
    .catch((err) => {
      throw err;
    });

  db_connect
    .collection("data")
    .deleteOne({ _id: ObjectId(req.body._id), author: res.locals._id })
    .then((result) => {
      if (result.deletedCount === 1) {
        db_connect
          .collection("data")
          .updateMany(
            { author: res.locals._id },
            { $pull: { links: req.body._id } },
            (err, obj) => {
              if (err) throw err;
            }
          );
        res.status(200).send({ message: "File deleted"});
      } else {
        if (output === 1) {
          res
            .status(200)
            .send({
              message: "File not found but id was deleted from Selection Tree",
            });
        } else {
          res.status(400).send({
            message: "Wrong parameters. Refresh page and try again",
          });
          return;
        }
      }
    })
    .catch((err) => {
      res
        .status(400)
        .send({ message: "Wrong parameters. Refresh page and try again" });
      throw err;
    });
});

recordRoutes.route("/addDirectory").post(authorization, (req, res) => {
  if (!req.body.name) {
    if (req.body.name == "") {
      req.body.name = "Directory";
    } else {
      res
        .status(400)
        .json({ message: "Wrong parameters. Refresh page and try again" });
      return;
    }
  }
  let db_connect = dbo.getDb("DandDT");

  var directory_id = ObjectId();
  var directory = { _id: directory_id, name: req.body.name, files: [] };

  db_connect
    .collection("login")
    .updateOne(
      { _id: ObjectId(res.locals._id) },
      {
        $push: {
          selectionTree: {
            $each: [directory],
            $position: 0,
          },
        },
      }
    )
    .then((result) => {
      res.status(200).json(directory);
    });
});

recordRoutes.route("/deleteDirectory").post(authorization, (req, res) => {
  if (!/^[0-9a-fA-F]{24}$/.test(req.body._id)) {
    res
      .status(400)
      .json({ message: "Wrong parameters. Refresh page and try again" });
    return;
  }
  let db_connect = dbo.getDb("DandDT");
  db_connect
    .collection("login")
    .findOne({ _id: ObjectId(res.locals._id) })
    .then((result) => {
      var directory_index = result.selectionTree.findIndex(
        (x) => x._id === req.body._id
      );
      if (directory_index === -1)
        res
          .status(400)
          .json({ message: "Wrong parameters. Refresh page and try again" });
      var files = result.selectionTree[directory_index].files;
      result.selectionTree.splice(directory_index, 1, ...files);

      db_connect
        .collection("login")
        .updateOne(
          { _id: ObjectId(res.locals._id) },
          { $set: { selectionTree: result.selectionTree } }
        )
        .then((result2) => {
          result2.newSelectionTree = result.selectionTree;
          res.status(200).json(result2);
        });
    });
});

recordRoutes.route("/exportFiles").get(authorization, async (req, res) => {
  let db_connect = dbo.getDb("DandDT");
  var await_treeselection = await db_connect
    .collection("login")
    .findOne(
      { _id: ObjectId(res.locals._id) },
      { projection: { selectionTree: 1 } }
    );
  db_connect
    .collection("data")
    .find({ author: res.locals._id })
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
    .findOne({ _id: ObjectId(res.locals._id) }, function (err, obj) {
      if (err) throw err;
      console.log(obj.selectionTree);
      if (obj.selectionTree) res.status(200).json(obj.selectionTree);
      else {
        //if selectionTree does not exist create new
        //great for reseting
        db_connect
          .collection("data")
          .find({ author: res.locals._id }, { projection: { _id: 1 } })
          .toArray((err, result) => {
            const array = [];
            result.forEach((element) => {
              array.push(element._id.toString());
            });
            db_connect
              .collection("login")
              .updateOne(
                { _id: ObjectId(res.locals._id) },
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
      { _id: ObjectId(res.locals._id) },
      { $set: { selectionTree: req.body.selectionTree } },
      function (err, result) {
        if (err) throw err;
        res.status(200).json(result);
      }
    );
});

module.exports = recordRoutes;
