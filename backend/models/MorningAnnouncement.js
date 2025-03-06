const mongoose = require('mongoose');

const morningAnnouncementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // документ удаляется через 24 часа (86400 секунд)
  },
});

module.exports = mongoose.model('MorningAnnouncement', morningAnnouncementSchema);
