const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        imageUrl: { type: String },
        author: { type: String, default: "Anonymous" },
    },
    { timestamps: true }
);

const News = mongoose.models.News || mongoose.model("News", newsSchema);

module.exports = News;