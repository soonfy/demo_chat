var express = require('express');
var router = express.Router();

const User = require('../app/controllers/user.js');

/* GET users listing. */
router.get('/', User.getLogin);

// router.get('/signup', User.getSign);
router.post('/signup', User.postSign);

// router.get('/signin', User.getLogin);
// router.post('/signin', User.postLogin);

module.exports = router;
