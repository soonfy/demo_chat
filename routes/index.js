var express = require('express');
var router = express.Router();

const Anon = require('../app/controllers/anon.js');

/* GET home page. */
router.get('/', Anon.getLogin);
router.get('/index', Anon.getIndex);
router.get('/chat', Anon.getChat);

module.exports = router;
