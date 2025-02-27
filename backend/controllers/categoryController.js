const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

// @desc Create new category
// @route POST /api/categories
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
};

// @desc Get single category by ID
// @route GET /api/categories/:id
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
};

// @desc Update category
// @route PUT /api/categories/:id
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id, 
      { name },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

// @desc Delete category
// @route DELETE /api/categories/:id
exports.deleteCategory = async (req, res, next) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};
