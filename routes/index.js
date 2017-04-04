var express = require('express');
var router = express.Router();

const Index = require('../app/controllers/index.js');
const Blog = require('../app/controllers/blog.js');

router.get('/index.html', Index.getIndex);

router.get('/home.html', Index.getHome);
router.get('/blog.html', Index.getBlog);
router.get('/chat.html', Index.getChat);
router.get('/tool.html', Index.getTool);
router.get('/about.html', Index.getAbout);

router.get('/post.html', Blog.getPost);
router.post('/post.html', Blog.postBlog);
router.get('/blog/:id.html', Blog.getBlog);

module.exports = router;
