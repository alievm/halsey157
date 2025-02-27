const multer = require('multer');
const path = require('path');

// Указываем, куда сохранять файлы и под каким именем
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // папка, куда сохраняем
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // например: 1674567890123-123456789.jpg
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Фильтрация по типу файла (опционально)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Допустимы только изображения!'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
