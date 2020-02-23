//setup services for users & posts

const express = require("express");
const router = express.Router();

const userService = require("../users/service");
const postService = require("../posts/service");

router.get("/users/add", userService.addUser);
router.get("/posts/add", postService.addPost);

module.exports = router;
