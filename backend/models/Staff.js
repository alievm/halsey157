const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    photos: [
      {
        type: String,
      },
    ],
    position: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Position',
      required: true,
    },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true, // если вы хотите делать выбор класса обязательным
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
