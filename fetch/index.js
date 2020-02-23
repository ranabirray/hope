"use strict";
require("dotenv").config();

//specify middlewares
const express = require("express");
const bodyParser = require("body-parser");

//specify port for node server to listen
const PORT = process.env.PORT;

//load common routes
const router = require("./router/router");

//load db file
const { initDb } = require("./loader/db");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

//define the routes
app.use("/", router);

//start the server
initDb(function (err) {
  app.listen(PORT, function (err) {
    if (err) {
      throw err;
    }
    console.log("Server running on port " + PORT);
  });
});
