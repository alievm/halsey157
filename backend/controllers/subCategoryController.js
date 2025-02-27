const SubCategory = require("../models/SubCategory");

exports.getAllSubCategories = async (req, res, next) => {
    try {
        const subCategories = await SubCategory.find().populate("name");
        res.status(200).json(subCategories);
    } catch (err) {
        next(err);
    }
};

exports.createSubCategory = async (req, res, next) => {
    try {
        const { name, categoryId } = req.body;
        const newSubCategory = new SubCategory({ name });
        const savedSubCategory = await newSubCategory.save();
        res.status(201).json(savedSubCategory);
    } catch (err) {
        next(err);
    }
};

exports.deleteSubCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        await SubCategory.findByIdAndDelete(id);
        res.status(200).json({ message: "SubCategory deleted successfully" });
    } catch (err) {
        next(err);
    }
};
