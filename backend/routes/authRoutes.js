const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Логин
router.post('/login', loginUser);

// Регистрация (если нужен, можно добавить отдельный роут)
router.post('/register', registerUser);

// Получение профиля пользователя
router.get('/profile', protect, getUserProfile);

// Новый маршрут для изменения пароля
router.put('/change-password', protect, changePassword);

module.exports = router;
