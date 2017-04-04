/**
 *  user controllers
 */

const UserModel = require('../models/user.js');

const postSignup = (req, res, next) => {
  let doc = req.body;
  UserModel._create(doc, (error, user) => {
    if (error) {
      console.error(error);
      res.redirect('/user/signup.html');
    } else {
      req.session.uid = user._id;
      req.session.name = user.name;
      res.redirect('/home.html');
    }
  })
}

const postLogin = (req, res, next) => {
  let doc = req.body;
  UserModel._read(doc, (error, user) => {
    if (error) {
      console.error(error);
      res.redirect('/user/login.html');
    } else {
      req.session.uid = user._id;
      req.session.name = user.name;
      res.redirect('/home.html');
    }
  })
}

const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
    } else {
      res.redirect('/index.html');
    }
  })
}

module.exports = {
  postSignup,
  postLogin,
  logout
}
