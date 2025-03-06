const Position = require('../models/Position');

// @desc Get all positions
// @route GET /api/positions
exports.getPositions = async (req, res, next) => {
  try {
    const positions = await Position.find({});
    res.json(positions);
  } catch (error) {
    next(error);
  }
};

// @desc Create new position
// @route POST /api/positions
exports.createPosition = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newPosition = await Position.create({ name });
    res.status(201).json(newPosition);
  } catch (error) {
    next(error);
  }
};

// @desc Get single position by id
// @route GET /api/positions/:id
exports.getPositionById = async (req, res, next) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(position);
  } catch (error) {
    next(error);
  }
};

// @desc Update position
// @route PUT /api/positions/:id
exports.updatePosition = async (req, res, next) => {
  try {
    const { name, priority } = req.body;
    const updatedPosition = await Position.findByIdAndUpdate(
      req.params.id,
      { name, priority },
      { new: true }
    );

    if (!updatedPosition) {
      return res.status(404).json({ message: 'Position not found' });
    }

    res.json(updatedPosition);
  } catch (error) {
    next(error);
  }
};

// @desc Delete position
// @route DELETE /api/positions/:id
exports.deletePosition = async (req, res, next) => {
  try {
    const deletedPosition = await Position.findByIdAndDelete(req.params.id);
    if (!deletedPosition) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json({ message: 'Position deleted' });
  } catch (error) {
    next(error);
  }
};
