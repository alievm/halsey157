const Author = require('../models/Author');

// @desc Get all authors
// @route GET /api/authors
exports.getAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find({});
    res.json(authors);
  } catch (error) {
    next(error);
  }
};

// @desc Create new author
// @route POST /api/authors
exports.createAuthor = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const newAuthor = await Author.create({ name, bio });
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
};

// @desc Get single author
// @route GET /api/authors/:id
exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
};

// @desc Update author
// @route PUT /api/authors/:id
exports.updateAuthor = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      { name, bio },
      { new: true }
    );
    if (!updatedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(updatedAuthor);
  } catch (error) {
    next(error);
  }
};

// @desc Delete author
// @route DELETE /api/authors/:id
exports.deleteAuthor = async (req, res, next) => {
  try {
    const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
    if (!deletedAuthor) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted' });
  } catch (error) {
    next(error);
  }
};
