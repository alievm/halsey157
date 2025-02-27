const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },
  // Можно добавить поля для соц. сетей, аватарки и т.д.
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema);
