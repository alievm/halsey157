const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // При необходимости можно добавить дополнительные поля, например:
    // description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Position', positionSchema);
