const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_IP, credentials: true }));
app.use(express.json());

app.use("/user", require("./routes/user"));
app.use("/", require("./routes/record"));

const dbo = require("./db/conn.js");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log("Server is running on port:" + port);
});
