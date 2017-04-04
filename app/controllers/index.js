/**
 *  nav controllers
 */

const BlogModel = require('../models/blog.js');

const getIndex = (req, res, next) => {
  if (!req.session.uid) {
    res.render('index', {
      title: '个人网站',
      subtitle: '学无止境，码无边界。'
    });
    return;
  }
  res.redirect('/home.html');
}

const getHome = (req, res, next) => {
  res.render('home', {
    title: '首页',
    name: req.session.uname,
    bread: [{
      name: '首页',
      href: null
    }]
  });
}

const getBlog = (req, res, next) => {
  BlogModel.find({}, {}, {
    sort: {
      createdAt: -1
    }
  }, (error, blogs) => {
    let lastBlogs = blogs;
    BlogModel.find({}, {}, {
      sort: {
        createdAt: 1
      }
    }, (error, blogs) => {
      let hotBlogs = blogs;
      res.render('list', {
        title: '博文列表',
        name: req.session.uname,
        bread: [{
          name: '首页',
          href: '/home.html'
        }, {
          name: '博文列表',
          href: null
        }],
        lastBlogs,
        hotBlogs
      });
    })
  })
}

const getChat = (req, res, next) => {
  res.render('chat', {
    title: '聊天室',
    name: req.session.uname,
    bread: [{
      name: '首页',
      href: '/home.html'
    }, {
      name: '聊天室',
      href: null
    }]
  });
}

const getTool = (req, res, next) => {
  res.render('tool', {
    title: '工具列表',
    name: req.session.uname,
    bread: [{
      name: '首页',
      href: '/home.html'
    }, {
      name: '工具列表',
      href: null
    }]
  });
}

const getAbout = (req, res, next) => {
  res.render('about', {
    title: '关于博主',
    name: req.session.uname,
    bread: [{
      name: '首页',
      href: '/home.html'
    }, {
      name: '关于博主',
      href: null
    }]
  });
}

module.exports = {
  getIndex,
  getHome,
  getBlog,
  getChat,
  getTool,
  getAbout
}
