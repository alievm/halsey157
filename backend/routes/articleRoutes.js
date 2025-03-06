const express = require('express');
const {
  getArticles,
  createArticle,
  getArticleById,
  updateArticle,
  deleteArticle,
  getArticlesByStaffId
} = require('../controllers/articleController');
const upload = require('../middlewares/upload');

const router = express.Router();

// Сначала определяем маршрут для получения статей по ID сотрудника
// router.get('/staff/:staffId/articles', getArticlesByStaffId);

// Основные маршруты для работы со статьями
router.route('/')
  .get(getArticles)
  .post(upload.single('photo'), createArticle);

router.route('/:id')
  .get(getArticleById)
  .put(upload.single('photo'), updateArticle)
  .delete(deleteArticle);

module.exports = router;
