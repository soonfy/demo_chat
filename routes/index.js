var express = require('express');
var router = express.Router();

const Index = require('../app/controllers/index.js');

/* GET home page. */
router.get('/index.html', Index.getIndex);
router.get('/home.html', Index.getHome);

router.get('/tool.html', Index.getTool);
router.get('/about.html', Index.getAbout);

router.get('/chat.html', Index.getChat);
router.get('/blog.html', Index.listBlog);
router.get('/post.html', Index.getBlog);
router.post('/post.html', Index.postBlog);

module.exports = router;
