const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Извлекаем токен из cookies запроса
  const token = req.cookies.jwt;

  // Проверяем, существует ли токен
  if (!token) {
    throw new Error('AuthorizationRequired');
  }

  let payload;

  try {
    // Пытаемся верифицировать токен с помощью секретного ключа
    // Если токен корректный, функция вернет "payload" (данные, закодированные в токене)
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new Error('AuthorizationRequired');
  }

  // Добавляем payload из токена в объект запроса, чтобы он был доступен в последующих обработчиках
  req.user = payload;

  next();
};
