const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  uid: {
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

const visitModel = mongoose.model('visit', visitSchema, 'owner_visits');
module.exports = visitModel;
