"use strict";

const express = require("express");
const indexController = require("./controllers/index");
const userController = require("./controllers/user");

const router = express.Router();

router.get("/",indexController.showIndex);
router.get("/register",userController.showRegister);
router.post("/register",userController.doRegister);
router.get("/login",userController.showLogin);
router.post("/login",userController.doLogin);
router.get('/captcha',userController.getCaptcha);
router.get('/logout',userController.doLogout);


module.exports = router;