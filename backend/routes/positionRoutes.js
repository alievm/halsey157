const express = require('express');
const {
  getPositions,
  createPosition,
  getPositionById,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');

const router = express.Router();

router.route('/')
  .get(getPositions)
  .post(createPosition);

router.route('/:id')
  .get(getPositionById)
  .put(updatePosition)
  .delete(deletePosition);

module.exports = router;
