const visitModel = require('../models/visit.js');

const getLogin = (req, res, next) => {
  visitModel.count({}).then((num) => {
    res.render('entry', {
      title: 'chat',
      subtitle: '勇士，这个世界需要你。',
      count: num
    });
  })
}

const getIndex = (req, res, next) => {
  res.render('index', {
    title: 'chat',
    subtitle: '勇士，这个世界欢迎你。'
  });
}

const getChat = (req, res, next) => {
  res.render('chat', {
    title: 'chat',
    subtitle: '勇士，这个世界欢迎你。'
  });
}

module.exports = {
  getLogin,
  getIndex,
  getChat
}
