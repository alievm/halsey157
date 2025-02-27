const express = require('express');
const {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Загрузка одной картинки (поле "photo" в form-data)
router.route('/')
  .get(getArticles)
  .post(upload.single('photo'), createArticle);

router.route('/:id')
  .get(getArticleById)
  .put(upload.single('photo'), updateArticle)
  .delete(deleteArticle);

module.exports = router;
