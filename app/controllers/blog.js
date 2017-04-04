/**
 *  blog controllers
 */

const BlogModel = require('../models/blog.js');

const getPost = (req, res, next) => {
  res.render('blog', {
    title: '发布博文',
    name: req.session.uname,
    bread: [{
      name: '首页',
      href: '/home.html'
    }, {
      name: '发布博文',
      href: null
    }]
  });
}

const postBlog = (req, res, next) => {
  let userId = req.session.uid;
  let {
    title,
    summary,
    key,
    content
  } = req.body;
  key = key.split(';');
  key = key.map(x => x.trim());
  let doc = {
    title,
    summary,
    key,
    content,
    userId
  };
  BlogModel._create(doc, (error, blog) => {
    if (error) {
      console.error(error);
      res.send(error);
    } else {
      res.send(blog);
    }
  })
}

const getBlog = (req, res, next) => {
  let {
    id
  } = req.params;
  BlogModel.findById(id, (error, blog) => {
    res.render('post', {
      title: blog.title,
      name: req.session.uname,
      blog,
      bread: [{
        name: '首页',
        href: '/home.html'
      }, {
        name: '博文列表',
        href: '/blog.html'
      }, {
        name: blog.title,
        href: null
      }]
    });
  })
}

module.exports = {
  getPost,
  postBlog,
  getBlog
}
