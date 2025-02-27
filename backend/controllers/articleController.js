const Article = require('../models/Article');
const path = require('path');

// @desc Get all articles
// @route GET /api/articles
exports.getArticles = async (req, res, next) => {
  try {
    // Формируем объект фильтрации
    let filter = {};

    // Если переданы параметры startDate и/или endDate, добавляем фильтр по дате
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) {
        filter.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filter.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Если передан параметр category, добавляем фильтр по категории
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Подгружаем связанные поля author и category, применяя фильтр
    const articles = await Article.find(filter)
      .populate('author', 'name bio')
      .populate('category', 'name');
    res.json(articles);
  } catch (error) {
    next(error);
  }
};


// @desc Create new article
// @route POST /api/articles
exports.createArticle = async (req, res, next) => {
  try {
    const { title, description, category, author } = req.body;

    // Если multer загружает файл, имя сохраняется в req.file
    let photoPath = null;
    if (req.file) {
      photoPath = req.file.path; // например, "uploads/1674567890-123123.jpg"
    }

    const newArticle = await Article.create({
      title,
      description,
      category,
      author,
      photo: photoPath
    });

    res.status(201).json(newArticle);
  } catch (error) {
    next(error);
  }
};

// @desc Get single article
// @route GET /api/articles/:id
exports.getArticleById = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name bio')
      .populate('category', 'name');
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    next(error);
  }
};

// @desc Update article
// @route PUT /api/articles/:id
exports.updateArticle = async (req, res, next) => {
  try {
    const { title, description, category, author } = req.body;

    const updateData = { title, description, category, author };

    // Если есть новое фото
    if (req.file) {
      updateData.photo = req.file.path;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(updatedArticle);
  } catch (error) {
    next(error);
  }
};

// @desc Delete article
// @route DELETE /api/articles/:id
exports.deleteArticle = async (req, res, next) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }
    // При желании, можно удалять файл фото с сервера (если нужно)
    // fs.unlinkSync(deletedArticle.photo) — осторожно, только если точно используете локальное хранение
    res.json({ message: 'Article deleted' });
  } catch (error) {
    next(error);
  }
};
