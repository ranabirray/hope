const express = require('express');
const router = express.Router();
const passport = require("passport");

const service = require('./users/service');

router.post('/users/login', service.authentication);
router.get('/users/:id', passport.authenticate("jwt", { session: false }), service.getUserDetail);
router.get('/users/:id/posts', passport.authenticate("jwt", { session: false }), service.getUserPosts);
router.get('/users', passport.authenticate("jwt", { session: false }), service.getUsers);
router.get('/posts', passport.authenticate("jwt", { session: false }), service.getPosts);
router.post('/users/upload', service.uploadImg);
router.post('/users/logout', passport.authenticate("jwt", { session: false }), service.logout);

module.exports = router;