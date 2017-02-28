const UserModel = require('../models/user.js');

const getLogin = (req, res, next) => {
  res.send('login page.');
}

const postSign = (req, res, next) => {
  let {
    name,
    password
  } = req.body;
  name = name.trim();
  password = password.trim();
  if (name.length === 0 || password.length === 0) {
    return res.redirect('back');
  }
  let _user = new UserModel({
    name,
    password,
    status: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  UserModel.find({ name: name })
    .then(() => {
      _user.save();
    })
    .then(() => {
      res.redirect('/index');
    })
    .catch((error) => {
      console.log(error);
      res.redirect('back');
    })
}

module.exports = {
  getLogin,
  postSign
}