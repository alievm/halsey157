const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  photo: {
    type: String, 
    // здесь будет храниться путь/имя файла (например, 'uploads/имя_фото.jpg')
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
