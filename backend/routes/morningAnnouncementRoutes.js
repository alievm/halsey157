const express = require('express');
const {
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require('../controllers/morningAnnouncementController');

const router = express.Router();

router.route('/')
  .get(getAllAnnouncements)
  .post(createAnnouncement);

router.route('/:id')
  .get(getAnnouncementById)
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

module.exports = router;
