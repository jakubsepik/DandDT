const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();
const port = process.env.PORT || 5000;
app.use(cors({ origin: process.env.FRONTEND_IP, credentials: true }));
app.use(express.json());

if(process.env.NODE_ENV!=="development")
  app.use(express.static(path.join("./","build")));
app.use("/api/user", require("./routes/user"));
app.use("/api", require("./routes/record"));

const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log("Server is running on port:" + port);
});
