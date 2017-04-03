const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: {
    type: String,
    index: true,
    required: true
  },
  summary: {
    type: String
  },
  key: {
    type: Array
  },
  content: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    default: '',
    required: true
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  }
});

blogSchema.static('_create', function (doc, cb) {
  doc.createdAt = doc.createdAt || new Date();
  doc.updatedAt = doc.updatedAt || new Date();
  this.create(doc, (error, _blog) => {
    if (error) {
      console.error(error);
      console.error(`[model] create ${doc.name} error.`);
      return cb(`${error.message}`)
    }
    cb(null, _blog);
  })
})

const blogModel = mongoose.model('blog', blogSchema, 'blogs');
module.exports = blogModel;
