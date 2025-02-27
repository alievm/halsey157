const ClassModel = require('../models/Class');

// @desc Get all classes
// @route GET /api/classes
exports.getClasses = async (req, res, next) => {
  try {
    const classes = await ClassModel.find({});
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

// @desc Create new class
// @route POST /api/classes
exports.createClass = async (req, res, next) => {
  try {
    const { title } = req.body;
    const newClass = await ClassModel.create({ title });
    res.status(201).json(newClass);
  } catch (error) {
    next(error);
  }
};

// @desc Get single class by id
// @route GET /api/classes/:id
exports.getClassById = async (req, res, next) => {
  try {
    const singleClass = await ClassModel.findById(req.params.id);
    if (!singleClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(singleClass);
  } catch (error) {
    next(error);
  }
};

// @desc Update class
// @route PUT /api/classes/:id
exports.updateClass = async (req, res, next) => {
  try {
    const { title } = req.body;
    const updatedClass = await ClassModel.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!updatedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json(updatedClass);
  } catch (error) {
    next(error);
  }
};

// @desc Delete class
// @route DELETE /api/classes/:id
exports.deleteClass = async (req, res, next) => {
  try {
    const deletedClass = await ClassModel.findByIdAndDelete(req.params.id);
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.json({ message: 'Class deleted' });
  } catch (error) {
    next(error);
  }
};
