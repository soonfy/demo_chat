var express = require('express');
var router = express.Router();

const User = require('../app/controllers/user.js');

/* GET users listing. */
// router.get('/', User.getLogin);

// router.get('/signup.html', User.getSignup);
router.post('/signup.html', User.postSignup);

// router.get('/signin', User.getLogin);
router.post('/signin.html', User.postLogin);

router.get('/logout.html', User.logout);

module.exports = router;
