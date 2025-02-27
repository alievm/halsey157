const Clothing = require("../models/Clothing");
const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");
const path = require('path');
const fs = require("fs");

exports.getAllClothing = async (req, res, next) => {
    try {
        const clothing = await Clothing.find();
        res.status(200).json(clothing);
    } catch (err) {
        next(err);
    }
};


exports.getClothingById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Ищем одежду по ID
        const clothing = await Clothing.findById(id).populate("categoryId subCategoryId");

        if (!clothing) {
            return res.status(404).json({ message: "Clothing not found" });
        }

        res.status(200).json(clothing);
    } catch (err) {
        next(err);
    }
};

exports.getClothingByFilter = async (req, res, next) => {
    try {
        const {
            subCategoryId,
            isTrending,
            name,
            sizes,
            colors,
            authorId,
            startDate,
            endDate
        } = req.query;

        const filter = {};

        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // Поиск по имени
        }

        if (subCategoryId) {
            filter.subCategoryId = subCategoryId; // Фильтр по подкатегории
        }

        if (isTrending !== undefined) {
            filter.isTrending = isTrending === 'true'; // Фильтр по трендам
        }

        if (sizes) {
            const sizesArray = sizes.split(','); // Преобразование в массив
            filter.sizes = { $in: sizesArray }; // Поиск, если есть хотя бы один из размеров
        }

        if (colors) {
            const colorsArray = colors.split(','); // Преобразование в массив
            filter.colors = { $in: colorsArray }; // Поиск по цветам
        }

        if (authorId) {
            filter.authors = authorId; // Фильтр по ID автора
        }

        if (startDate || endDate) {
            filter.createdAt = {}; // Диапазон по дате создания
            if (startDate) {
                filter.createdAt.$gte = new Date(startDate); // Дата "с"
            }
            if (endDate) {
                filter.createdAt.$lte = new Date(endDate); // Дата "по"
            }
        }

        const clothing = await Clothing.find(filter)
            .populate("categoryId subCategoryId authors"); // Добавлено заполнение авторов

        res.status(200).json(clothing);
    } catch (err) {
        next(err);
    }
};


exports.getClothingBySubCategory = async (req, res, next) => {
    try {
        const { subCategoryId } = req.query;

        // Если subCategoryId не указан, вернуть все записи
        const filter = subCategoryId ? { subCategoryId } : {};

        const clothing = await Clothing.find(filter)
            .populate("categoryId subCategoryId");
        res.status(200).json(clothing);
    } catch (err) {
        next(err);
    }
};

exports.getTrendingClothing = async (req, res, next) => {
    try {
        const trendingClothing = await Clothing.find({ isTrending: true })
            .populate("categoryId subCategoryId");
        res.status(200).json(trendingClothing);
    } catch (err) {
        next(err);
    }
};

exports.updateClothingTrending = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isTrending } = req.body;

        // Проверяем, существует ли одежда с таким ID
        const clothing = await Clothing.findById(id);
        if (!clothing) {
            return res.status(404).json({ message: "Clothing not found" });
        }

        // Обновляем статус тренда
        clothing.isTrending = isTrending;
        const updatedClothing = await clothing.save();

        res.status(200).json(updatedClothing);
    } catch (err) {
        next(err);
    }
};


exports.createClothing = async (req, res, next) => {
    try {
        const { name, categoryId, subCategoryId, sizes, colors, description, authors  } = req.body;
        const files = req.files; // Array of additional images
        const imageFile = req.files?.file ? req.files.file[0] : null; // Main image

        if (!categoryId) {
            return res.status(400).json({ message: "Category ID is required" });
        }

        const category = await Category.findById(categoryId);
        if (!category) return res.status(404).json({ message: "Category not found" });

        if (subCategoryId) {
            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) return res.status(404).json({ message: "Subcategory not found" });
            if (subCategory.categoryId && subCategory.categoryId.toString() !== categoryId) {
                return res.status(400).json({ message: "Invalid subcategory for the selected category" });
            }
        }

        const uploadDir = path.join(__dirname, "../uploads/images");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        let imageUrl = "";
        if (imageFile) {
            const imagePath = path.join(uploadDir, imageFile.originalname);
            fs.writeFileSync(imagePath, imageFile.buffer);
            imageUrl = `/uploads/images/${imageFile.originalname}`;
        }

        const images = [];
        if (files && files.files) {
            files.files.forEach(file => {
                const imagePath = path.join(uploadDir, file.originalname);
                fs.writeFileSync(imagePath, file.buffer);
                images.push(`/uploads/images/${file.originalname}`);
            });
        }

        const newClothing = new Clothing({
            name,
            categoryId,
            subCategoryId,
            sizes,
            colors,
            imageUrl,
            images,
            description,
            authors,
        });

        const savedClothing = await newClothing.save();
        res.status(201).json(savedClothing);
    } catch (err) {
        next(err);
    }
};

exports.updateClothing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, categoryId, subCategoryId, sizes, colors, description, authors, } = req.body;
        const files = req.files;
        const imageFile = req.files?.file ? req.files.file[0] : null;

        // Find the clothing item by ID
        const clothing = await Clothing.findById(id);
        if (!clothing) {
            return res.status(404).json({ message: "Clothing not found" });
        }

        // Validate category
        if (categoryId) {
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }
        }

        // Validate subcategory
        if (subCategoryId) {
            const subCategory = await SubCategory.findById(subCategoryId);
            if (!subCategory) {
                return res.status(404).json({ message: "Subcategory not found" });
            }
        }

        // Handle image upload if new image is provided
        const uploadDir = path.join(__dirname, "../uploads/images");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        let imageUrl = clothing.imageUrl; // Default to the existing image URL if no new image
        if (imageFile) {
            // Delete the old image if replacing
            const oldImagePath = path.join(__dirname, "..", clothing.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            const imagePath = path.join(uploadDir, imageFile.originalname);
            fs.writeFileSync(imagePath, imageFile.buffer); // Save new main image
            imageUrl = `/uploads/images/${imageFile.originalname}`;
        }

        const images = [...clothing.images]; // Retain old images
        if (files && files.files) {
            // Remove old additional images if necessary and add new ones
            files.files.forEach(file => {
                const imagePath = path.join(uploadDir, file.originalname);
                fs.writeFileSync(imagePath, file.buffer); // Save additional image
                images.push(`/uploads/images/${file.originalname}`);
            });
        }

        // Update the clothing item
        clothing.name = name || clothing.name;
        clothing.categoryId = categoryId || clothing.categoryId;
        clothing.subCategoryId = subCategoryId || clothing.subCategoryId;
        clothing.sizes = sizes || clothing.sizes;
        clothing.colors = colors || clothing.colors;
        clothing.description = description || clothing.description;
        clothing.authors = authors || clothing.authors;
        clothing.imageUrl = imageUrl;
        clothing.images = images;

        const updatedClothing = await clothing.save();

        res.status(200).json(updatedClothing);
    } catch (err) {
        next(err);
    }
};



exports.deleteClothing = async (req, res, next) => {
    try {
        const { id } = req.params;
        await Clothing.findByIdAndDelete(id);
        res.status(200).json({ message: "Clothing deleted successfully" });
    } catch (err) {
        next(err);
    }
};
