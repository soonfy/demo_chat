var express = require('express');
var router = express.Router();

const Index = require('../app/controllers/index');
const Blog = require('../app/controllers/blog');
const middle = require('./middle');

router.get('/', Index.getIndex);
router.get('/index.html', Index.getIndex);

router.get('/home.html', Index.getHome);
router.get('/blog.html', middle.countBlog(), middle.countKeys(), Index.getBlog);
router.get('/chat.html', Index.getChat);
router.get('/tool.html', Index.getTool);
router.get('/about.html', Index.getAbout);

router.get('/post.html', Blog.getPost);
router.post('/post.html', Blog.postBlog);
router.get('/blog/:id.html', Blog.getBlog);

router.get('/blog/key/:key.html', middle.countBlog(), middle.countKeys(), Blog.getKey);

router.get('/search.html', middle.countBlog(), middle.countKeys(), Index.search);

module.exports = router;
