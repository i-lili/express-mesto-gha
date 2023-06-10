const jwt = require('jsonwebtoken');

// Экспортируем middleware для проверки авторизации пользователя
module.exports = (req, res, next) => {
  // Извлекаем заголовок авторизации
  const { authorization } = req.headers;

  // Проверяем наличие и формат заголовка
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Error('AuthorizationRequired');
  }

  // Удаляем "Bearer " из заголовка, чтобы получить токен
  const token = authorization.replace('Bearer ', '');

  let payload;

  // Верифицируем токен
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new Error('AuthorizationRequired');
  }

  // Если верификация прошла успешно, добавляем payload в запрос
  req.user = payload;

  // Передаём обработку запроса дальше
  next();
};
