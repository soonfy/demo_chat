/**
 *  user events
 */
const UserModel = require('../models/user.js');

const postSignup = (req, res, next) => {
  let user = req.body;
  console.log(user);
  UserModel._create(user, (error, doc) => {
    if (error) {
      console.error(error);
      res.redirect('/user/signup.html');
    } else {
      req.session.uid = doc._id;
      req.session.name = doc.name;
      res.redirect('/home.html');
    }
  })
}

const postLogin = (req, res, next) => {
  let user = req.body;
  console.log(user);
  UserModel._read(user, (error, doc) => {
    if (error) {
      console.error(error);
      res.redirect('/user/login.html');
    } else {
      req.session.uid = doc._id;
      req.session.name = doc.name;
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
