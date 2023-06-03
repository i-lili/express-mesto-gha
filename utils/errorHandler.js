const errorHandler = (err, req, res, next) => {
  let statusCode = 500; // Код ошибки по умолчанию
  let message = 'Внутренняя ошибка сервера';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Переданы некорректные данные';
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;

    // Определение сообщения об ошибке 404 в зависимости от контекста вызывающего кода
    if (req.originalUrl.startsWith('/users')) {
      message = 'Пользователь не найден';
    } else if (req.originalUrl.startsWith('/cards')) {
      message = 'Карточка не найдена';
    }
  }

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
