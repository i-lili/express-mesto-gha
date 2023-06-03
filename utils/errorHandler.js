// Константы для сообщений об ошибках
const DEFAULT_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
const VALIDATION_ERROR_MESSAGE = 'Переданы некорректные данные';
const USER_NOT_FOUND_ERROR_MESSAGE = 'Пользователь не найден';
const CARD_NOT_FOUND_ERROR_MESSAGE = 'Карточка не найдена';
const INVALID_ID_ERROR_MESSAGE = 'Передан некорректный id';

// Функция для проверки, является ли строка валидным ObjectId
const isValidObjectId = (id) => id.match(/^[0-9a-fA-F]{24}$/);

// Функция для определения сообщения об ошибке, если ресурс не найден
const getNotFoundErrorMessage = (req) => {
  if (req.originalUrl.startsWith('/users')) {
    return USER_NOT_FOUND_ERROR_MESSAGE;
  }
  if (req.originalUrl.startsWith('/cards')) {
    return CARD_NOT_FOUND_ERROR_MESSAGE;
  }
  return DEFAULT_ERROR_MESSAGE;
};

// Обработка ошибки валидации
const handleValidationError = (err, req, res) => {
  res
    .status(400)
    .json({ message: VALIDATION_ERROR_MESSAGE });
};

// Обработка ошибки преобразования (CastError)
const handleCastError = (err, req, res) => {
  const isObjectIdValid = isValidObjectId(err.value);
  // Если ObjectId валиден, статус код будет 404, иначе 400
  const statusCode = isObjectIdValid ? 404 : 400;
  // Если ObjectId валиден, сообщение об ошибке зависит от типа ресурса,
  // иначе это сообщение об ошибке некорректного id
  const message = isObjectIdValid
    ? getNotFoundErrorMessage(req)
    : INVALID_ID_ERROR_MESSAGE;

  res.status(statusCode).json({ message });
};

// Обработка кастомных ошибок, таких как 'UserNotFound' или 'CardNotFound'
const handleCustomErrors = (err, req, res) => {
  let message = DEFAULT_ERROR_MESSAGE;
  if (err.message === 'UserNotFound') {
    message = USER_NOT_FOUND_ERROR_MESSAGE;
  } else if (err.message === 'CardNotFound') {
    message = CARD_NOT_FOUND_ERROR_MESSAGE;
  }
  res.status(404).json({ message });
};

// Главный обработчик ошибок, который вызывает соответствующую функцию в зависимости от типа ошибки
const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case 'ValidationError':
      handleValidationError(err, req, res);
      break;
    case 'CastError':
      handleCastError(err, req, res);
      break;
    default:
      handleCustomErrors(err, req, res);
  }
};

module.exports = errorHandler;
