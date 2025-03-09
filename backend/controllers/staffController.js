// controllers/staffController.js
const mongoose = require('mongoose'); // Добавляем импорт mongoose
const Staff = require('../models/Staff');

// @desc Get all staff
// @route GET /api/staff
exports.getStaff = async (req, res, next) => {
  try {
    let match = {};

    // Если передан параметр "class" в query, добавляем фильтр
    if (req.query.class) {
      match.class = new mongoose.Types.ObjectId(req.query.class);
    }

    const staffList = await Staff.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'positions', // имя коллекции для позиций
          localField: 'position',
          foreignField: '_id',
          as: 'position'
        }
      },
      { $unwind: '$position' },
      {
        $lookup: {
          from: 'classes', // имя коллекции для классов
          localField: 'class',
          foreignField: '_id',
          as: 'class'
        }
      },
      { $unwind: '$class' },
      // Сортировка: сначала по приоритету позиции (ascending), затем по дате создания (ascending)
      { $sort: { 'position.priority': 1, createdAt: 1 } }
    ]);

    res.json(staffList);
  } catch (error) {
    next(error);
  }
};

// @desc Create new staff
// @route POST /api/staff
exports.createStaff = async (req, res, next) => {
  try {
    const { name, description, position, class: classId } = req.body;

    let photosPaths = [];
    if (req.files && req.files.length > 0) {
      photosPaths = req.files.map((file) => file.path);
    }

    const newStaff = await Staff.create({
      name,
      description,
      position,
      class: classId, // <-- передаём ID класса
      photos: photosPaths,
    });

    res.status(201).json(newStaff);
  } catch (error) {
    next(error);
  }
};

// @desc Get single staff by id
// @route GET /api/staff/:id
exports.getStaffById = async (req, res, next) => {
  try {
    const staffMember = await Staff.findById(req.params.id)
      .populate('position', 'name');
    if (!staffMember) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json(staffMember);
  } catch (error) {
    next(error);
  }
};

// @desc Update staff
// @route PUT /api/staff/:id
exports.updateStaff = async (req, res, next) => {
  try {
    const { name, description, position, class: classId } = req.body; // добавляем class
    const updateData = { name, description, position };

    if (classId) {
      updateData.class = classId; // обновляем поле class, если оно передано
    }

    if (req.files && req.files.length > 0) {
      updateData.photos = req.files.map((file) => file.path);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    res.json(updatedStaff);
  } catch (error) {
    next(error);
  }
};

// @desc Delete staff
// @route DELETE /api/staff/:id
exports.deleteStaff = async (req, res, next) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.json({ message: 'Staff member deleted' });
  } catch (error) {
    next(error);
  }
};
