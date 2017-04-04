var express = require('express');
var router = express.Router();

const User = require('../app/controllers/user.js');

router.post('/signup.html', User.postSignup);

router.post('/signin.html', User.postLogin);

router.get('/logout.html', User.logout);

module.exports = router;
