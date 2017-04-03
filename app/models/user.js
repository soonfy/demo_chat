const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crypto = require('crypto');
const str = 'qwertyuiopasdfghjklzxcvbnm1234567890';
const len = str.length;

const minlength = [2, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'];
const maxlength = [10, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];
const pslength = [20, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    minlength,
    maxlength,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  password: {
    type: String,
    minlength,
    // maxlength: pslength,
    required: true
  },
  // 0 - 注册未认证
  // 1 - 注册并认证
  // -1 - 注销
  status: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.static('_create', function (doc, cb) {
  let salt = '',
    ind = 0,
    password = doc.password;
  while (ind <= 11) {
    ++ind;
    salt += str.charAt(Math.floor(Math.random() * len));
  }
  doc.salt = salt;
  const hmac = crypto.createHmac('md5', salt);
  doc.password = hmac.update(password).digest('hex');
  doc.createdAt = doc.createdAt || new Date();
  doc.updatedAt = doc.updatedAt || new Date();
  this.create(doc, (error, _user) => {
    if (error) {
      console.error(error);
      console.error(`[model] create ${doc.name} error.`);
      return cb(`${error.message}`)
    }
    cb(null, _user);
  })
})

userSchema.static('_read', function (doc, cb) {
  this.findOne({
    name: doc.name
  }, (error, _user) => {
    if (error) {
      console.error(error);
      // 查询出错
      return cb(new Error(`find error.`));
    }
    if (!_user) {
      // 用户名没找到
      return cb(new Error(`name error.`));
    }
    const hmac = crypto.createHmac('md5', _user.salt);
    let password = hmac.update(doc.password).digest('hex');
    if (password === _user.password) {
      return cb(null, _user);
    }
    cb(new Error(`pass error.`));
  })
})

const userModel = mongoose.model('user', userSchema, 'users');

module.exports = userModel;
