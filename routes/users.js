var express = require('express');
var router = express.Router();

const User = require('../app/controllers/user.js');

/* GET users listing. */
router.get('/', User.getLogin);

module.exports = router;
