// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // если нужно найти пользователя в базе

const protect = async (req, res, next) => {
  let token;

  // Проверяем, что в заголовке Authorization передан токен, например, в формате "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Извлекаем токен из заголовка
      token = req.headers.authorization.split(' ')[1];
      
      // Верифицируем токен
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Можно (при необходимости) найти пользователя по decoded.id
      // req.user = await User.findById(decoded.id).select('-password');
      
      // Если всё хорошо, сохраняем информацию о пользователе в req и передаём управление дальше
      req.user = decoded; 
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Неавторизованный доступ, неверный токен' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Неавторизованный доступ, токен не найден' });
  }
};

module.exports = { protect };
