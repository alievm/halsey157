// newsController.js
const News = require("../models/News");
const path = require("path");
const fs = require("fs");

exports.getAllNews = async (req, res, next) => {
    try {
        const news = await News.find();
        res.status(200).json(news);
    } catch (err) {
        next(err);
    }
};

exports.getNewsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newsItem = await News.findById(id);
        if (!newsItem) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json(newsItem);
    } catch (err) {
        next(err);
    }
};

exports.createNews = async (req, res, next) => {
    try {
        const { title, content, author } = req.body;
        const imageFile = req.file;

        let imageUrl = "";
        if (imageFile) {
            const uploadDir = path.join(__dirname, "../uploads/news");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const imagePath = path.join(uploadDir, imageFile.originalname);
            fs.writeFileSync(imagePath, imageFile.buffer);
            imageUrl = `/uploads/news/${imageFile.originalname}`;
        }

        const newNews = new News({ title, content, author, imageUrl });
        const savedNews = await newNews.save();
        res.status(201).json(savedNews);
    } catch (err) {
        next(err);
    }
};

exports.updateNews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, author } = req.body;

        const newsItem = await News.findById(id);
        if (!newsItem) {
            return res.status(404).json({ message: "News not found" });
        }

        if (req.file) {
            const imageFile = req.file;
            const uploadDir = path.join(__dirname, "../uploads/news");
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const imagePath = path.join(uploadDir, imageFile.originalname);
            fs.writeFileSync(imagePath, imageFile.buffer);
            newsItem.imageUrl = `/uploads/news/${imageFile.originalname}`;
        }

        newsItem.title = title || newsItem.title;
        newsItem.content = content || newsItem.content;
        newsItem.author = author || newsItem.author;

        const updatedNews = await newsItem.save();
        res.status(200).json(updatedNews);
    } catch (err) {
        next(err);
    }
};

exports.deleteNews = async (req, res, next) => {
    try {
        const { id } = req.params;
        const newsItem = await News.findByIdAndDelete(id);
        if (!newsItem) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json({ message: "News deleted successfully" });
    } catch (err) {
        next(err);
    }
};
