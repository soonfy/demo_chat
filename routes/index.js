var express = require('express');
var router = express.Router();

const Anon = require('../app/controllers/anon.js');

/* GET home page. */
router.get('/', Anon.getLogin);

module.exports = router;
