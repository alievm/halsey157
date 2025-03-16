const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким username уже существует' });
    }

    const user = new User({
        username,
        password
    });

    await user.save();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: 'Неверный username или пароль' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Неверный username или пароль' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
};

// Получение текущего пользователя по токену
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Функция изменения пароля
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверка текущего пароля
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Текущий пароль неверен' });
        }

        // Обновление пароля
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, changePassword };
