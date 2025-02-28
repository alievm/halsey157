const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Регистрация
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Проверяем логин и пароль
    if (username === 'admin102' && password === 'Queens102Street!') {
        // Создаем токен
        const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(400).json({ message: 'Неверный логин или пароль' });
    }
});

// Логин
router.post('/login', loginUser);

// Получение профиля пользователя
router.get('/profile', protect, getUserProfile);

module.exports = router;
