const MorningAnnouncement = require('../models/MorningAnnouncement');

// Получить все объявления
exports.getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await MorningAnnouncement.find();
    res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// Получить объявление по id
exports.getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await MorningAnnouncement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    next(error);
  }
};

// Создать новое объявление
exports.createAnnouncement = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const announcement = new MorningAnnouncement({ title, description });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

// Обновить объявление по id
exports.updateAnnouncement = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const announcement = await MorningAnnouncement.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json(announcement);
  } catch (error) {
    next(error);
  }
};

// Удалить объявление по id
exports.deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await MorningAnnouncement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    res.json({ message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
};
