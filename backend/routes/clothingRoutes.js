const express = require("express");
const { getAllClothing, createClothing, deleteClothing, getClothingBySubCategory, getTrendingClothing,
    updateClothingTrending, getClothingByFilter, updateClothing, getClothingById
} = require("../controllers/clothingController");
const multer = require("multer");


const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// @route   GET /api/clothing
// @desc    Получить весь каталог одежды
router.get("/", getAllClothing);


// @route   GET /api/clothing/by-subcategory
// @desc    Получить одежду по подкатегории
router.get('/filter', getClothingByFilter);

router.get("/by-subcategory", getClothingBySubCategory);

router.get("/trending", getTrendingClothing);

router.patch("/:id", updateClothingTrending);

router.get("/:id", getClothingById);

// @route   POST /api/clothing
// @desc    Добавить новую одежду с возможностью загрузки изображения
router.post("/", upload.fields([{ name: "file", maxCount: 1 }, { name: "files", maxCount: 10 }]), createClothing);
router.patch("/update/:id", upload.fields([{ name: "file", maxCount: 1 }, { name: "files", maxCount: 10 }]), updateClothing);

// @route   DELETE /api/clothing/:id
// @desc    Удалить одежду
router.delete("/:id", deleteClothing);

module.exports = router;
