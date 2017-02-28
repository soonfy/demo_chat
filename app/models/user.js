const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minlength = [2, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'];
const maxlength = [10, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];
const pslength = [20, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];

const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
    minlength,
    maxlength
  },
  password: {
    type: String,
    minlength,
    maxlength: pslength
  },
  // 0 - 注册未认证
  // 1 - 注册并认证
  // -1 - 注销
  status: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date
  }
})

userSchema.pre('save', (next) => {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  if (!this.updatedAt) {
    this.updatedAt = new Date();
  }
  next();
})

userSchema.post('save', (doc) => {
  console.log(`user ${doc.name} saves success.`);
})

userSchema.post('find', (docs) => {
  console.log(`find success, all ${docs.length} data.`);
})

const userModel = mongoose.model('user', userSchema, 'owner_users');
module.exports = userModel;