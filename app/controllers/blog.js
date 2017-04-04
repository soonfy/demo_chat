/**
 *  blog controllers
 */

const BlogModel = require('../models/blog.js');

const getPost = (req, res, next) => {
  res.locals.bread.push({
    name: '发布博文',
    href: null
  });
  res.render('post', {
    title: '发布博文',
    name: req.session.uname
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
  res.locals.bread.push({
    name: '博文列表',
    href: '/blog.html'
  });
  let {
    id
  } = req.params;
  BlogModel.findById(id, (error, blog) => {
    res.locals.bread.push({
      name: blog.title,
      href: null
    });
    res.render('blog', {
      title: blog.title,
      name: req.session.uname,
      blog
    });
  })
}

const getKey = (req, res, next) => {
  let {
    key
  } = req.params;
  res.locals.bread.push({
    name: '博文列表',
    href: '/blog.html'
  });
  res.locals.bread.push({
    name: key,
    href: null
  });
  BlogModel.find({
    key: key
  }, (error, blogs) => {
    let hotBlogs = blogs;
    res.render('list', {
      title: key,
      name: req.session.uname,
      blogs,
      hotBlogs
    });
  })
}

module.exports = {
  getPost,
  postBlog,
  getBlog,
  getKey
}
