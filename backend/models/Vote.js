const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    options: [
        {
            option: { type: String, required: true },
            votes: { type: Number, default: 0 },
        },
    ],
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('Vote', voteSchema);
