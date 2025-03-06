const express = require('express');
const {
  getStaff,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { getArticlesByStaffId } = require('../controllers/articleController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/')
  .get(getStaff)
  .post(upload.array('photos', 10), createStaff); // до 10 файлов

// Новый маршрут для получения статей сотрудника
router.get('/:staffId/articles', getArticlesByStaffId);

router.route('/:id')
  .get(getStaffById)
  .put(upload.array('photos', 10), updateStaff)
  .delete(deleteStaff);

module.exports = router;
