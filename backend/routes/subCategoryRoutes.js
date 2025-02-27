const express = require("express");
const { getAllSubCategories, createSubCategory, deleteSubCategory } = require("../controllers/subCategoryController");

const router = express.Router();

router.get("/", getAllSubCategories);
router.post("/", createSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
