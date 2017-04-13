/**
 *  nav controllers
 */

const BlogModel = require('../models/blog.js');

const getScore = (blog, reg) => {
  let {
    title,
    summary,
    key,
    content
  } = blog;
  let tscore = 400,
    kscore = 300,
    sscore = 200,
    cscore = 100;
  let score = (tscore * (title.match(reg) || []).join('').length / (title.length || 1) + kscore * (key.join('').match(reg) || []).join('').length / (key.join('').length || 1) + sscore * (summary.match(reg) || []).join('').length / (summary.length || 1) + cscore * (content.match(reg) || []).join('').length / (content.length || 1)) / (tscore + kscore + sscore + cscore);
  return score;
}

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
    name: req.session.uname
  });
}

const getBlog = (req, res, next) => {
  res.locals.bread.push({
    name: '博文列表',
    href: null
  });
  BlogModel.find({}, {}, {
    sort: {
      createdAt: -1
    }
  }, (error, blogs) => {
    if (error) {
      console.error(error);
      res.redirect('back');
    }
    res.render('list', {
      title: '博文列表',
      name: req.session.uname,
      blogs
    });
  })
}

const getChat = (req, res, next) => {
  res.locals.bread.push({
    name: '聊天室',
    href: null
  });
  res.render('chat', {
    title: '聊天室',
    name: req.session.uname
  });
}

const getTool = (req, res, next) => {
  res.locals.bread.push({
    name: '工具列表',
    href: null
  });
  res.render('tool', {
    title: '工具列表',
    name: req.session.uname
  });
}

const getAbout = (req, res, next) => {
  res.locals.bread.push({
    name: '关于博主',
    href: null
  });
  res.render('about', {
    title: '关于博主',
    name: req.session.uname
  });
}

const search = (req, res, next) => {
  let {
    key
  } = req.query;
  if (!key) {
    res.redirect('/blog.html');
  }
  res.locals.bread.push({
    name: key,
    href: null
  });
  let reg = new RegExp(key, 'igm');
  BlogModel.find({
    $or: [{
      title: reg
    }, {
      summary: reg
    }, {
      content: reg
    }, {
      key: reg
    }]
  }, (error, blogs) => {
    if (error) {
      console.error(error);
      res.redirect('back');
    } else {
      let results = blogs.map(blog => {
        blog.score = getScore(blog, reg).toFixed(3);
        return blog;
      }).sort((a, b) => b.score - a.score);
      res.render('search', {
        title: '查询结果',
        name: req.session.uname,
        keyword: key,
        results
      });
    }
  })
}

module.exports = {
  getIndex,
  getHome,
  getBlog,
  getChat,
  getTool,
  getAbout,
  search
}
