const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const user = new User({
        username,
        email,
        password
    });

    await user.save();
    res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
};

// Логин пользователя
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Неверный email или пароль' });
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



// При генерации токена используйте process.env.JWT_SECRET
const token = jwt.sign({ username: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });



module.exports = { registerUser, loginUser, getUserProfile };
