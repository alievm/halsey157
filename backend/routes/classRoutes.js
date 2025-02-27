const express = require('express');
const {
  getClasses,
  createClass,
  getClassById,
  updateClass,
  deleteClass
} = require('../controllers/classController');

const router = express.Router();

router.route('/')
  .get(getClasses)
  .post(createClass);

router.route('/:id')
  .get(getClassById)
  .put(updateClass)
  .delete(deleteClass);

module.exports = router;
