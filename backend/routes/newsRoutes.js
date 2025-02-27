const express = require("express");
const multer = require("multer");
const {
    getAllNews,
    getNewsById,
    createNews,
    updateNews,
    deleteNews,
} = require("../controllers/newsController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/", upload.single("file"), createNews);
router.put("/:id", upload.single("file"), updateNews);
router.delete("/:id", deleteNews);

module.exports = router;
