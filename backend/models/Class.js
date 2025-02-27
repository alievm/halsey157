const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
