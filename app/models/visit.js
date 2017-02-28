const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const minlength = [2, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).'];
const maxlength = [10, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];
const pslength = [20, 'The value of path `{PATH}` (`{VALUE}`) is longer than the maxmum allowed length ({MAXLENGTH}).'];

const visitSchema = new Schema({
  ip: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  user: {
    type: String,
    default: ''
  },
  visitedAt: {
    type: Date,
  }
})

visitSchema.pre('save', function (next) {
  if (!this.visitedAt) {
    this.visitedAt = new Date();
  }
  next();
})

visitSchema.post('save', (doc) => {
  console.log(`user visit ${doc.title} saved success.`);
})

visitSchema.post('find', (docs) => {
  console.log(`find success, all ${docs.length} data.`);
})

visitSchema.post('findOne', (doc) => {
  if (doc) {
    console.log(`findOne data.`);
    console.log(doc);
  } else {
    console.log(`findOne no data.`);
  }
})

visitSchema.post('count', (num) => {
  console.log(`count success, all ${num} data.`);
})

const visitModel = mongoose.model('visit', visitSchema, 'owner_visits');
module.exports = visitModel;
