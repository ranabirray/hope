"use strict"

require('dotenv').config();

//specify middlewares
const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router');
const passport = require("passport");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT;//specify port for node server to listen
const { initDb } = require("./loader/db");//connect to database

app.use(cors());
app.use(passport.initialize());

require("./helper/passport")(passport);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use('/', router);

//start server
initDb(function (err) {
    app.listen(PORT, function (err) {
        if (err) {
            throw err; //
        }
        console.log("Server running on port " + PORT);
    });
});