// models/Position.js
const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Числовое значение приоритета (чем меньше число, тем выше приоритет)
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Position', positionSchema);
