"use strict";

const express = require("express");
const router = require("./router");
const bodyParser = require("body-parser");
const config = require("./config");
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const ccap = require('ccap');

const app = express();

app.set("views",path.join(__dirname,'views'));
app.set("view engine","xtpl");

app.use("/www",express.static("www"));

app.use(bodyParser.urlencoded({extended:false}));

app.use(function (req,res,next) {
    app.locals.config = config;
    next();
});

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));

app.use(router);

if(configs.debug){
    app.use(function (err,req,res,next) {
        res.send(`糟了，出错了：${err.message}`);
    });
}

app.listen(3000,"127.0.0.1",function () {
    console.log("server is running at port 3000");
});


