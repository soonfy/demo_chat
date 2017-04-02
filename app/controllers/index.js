/**
 *  anon events
 */
const visitModel = require('../models/visit.js');

const getIndex = (req, res, next) => {
  if (!req.session.name) {
    res.render('index', {
      title: '个人网站',
      subtitle: '勇士，这个世界欢迎你。'
    });
    return;
  }
  res.render('home', {
    title: '首页',
    name: req.session.name
  });
}

const getHome = (req, res, next) => {
  res.render('home', {
    title: '首页',
    name: req.session.name
  });
}

const getChat = (req, res, next) => {
  // res.cookie('name', 'soonfy', { domain: 'soonfy.com', path: '/', secure: true, expires: new Date(Date.now() + 900000), httpOnly: true,maxAge:900000, user: req.session.user});
  res.render('chat', {
    title: '聊天室',
    name: req.session.name
  });
}

const listBlog = (req, res, next) => {
  res.render('list', {
    title: '博文列表',
    name: req.session.name
  });
}

const getBlog = (req, res, next) => {
  res.render('blog', {
    title: '发布博文',
    name: req.session.name
  });
}

const postBlog = (req, res, next) => {
  res.render('post', {
    title: 'post',
    name: req.session.name
  });
}

const getTool = (req, res, next) => {
  res.render('tool', {
    title: '工具列表',
    name: req.session.name
  });
}

const getAbout = (req, res, next) => {
  res.render('about', {
    title: '关于博主',
    name: req.session.name
  });
}

module.exports = {
  getIndex,
  getHome,
  getChat,
  listBlog,
  getBlog,
  postBlog,
  getTool,
  getAbout
}
