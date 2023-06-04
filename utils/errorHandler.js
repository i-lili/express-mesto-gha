// Константы для статус-кодов
const STATUS_CODE_BAD_REQUEST = 400; // Некорректный запрос
const STATUS_CODE_NOT_FOUND = 404; // Ресурс не найден
const STATUS_CODE_INTERNAL_SERVER_ERROR = 500; // Внутренняя ошибка сервера

// Константы для сообщений об ошибках
const DEFAULT_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
const VALIDATION_ERROR_MESSAGE = 'Переданы некорректные данные';
const INVALID_ID_ERROR_MESSAGE = 'Передан некорректный id';
const USER_NOT_FOUND_ERROR_MESSAGE = 'Пользователь не найден';
const CARD_NOT_FOUND_ERROR_MESSAGE = 'Карточка не найдена';
const RESOURCE_NOT_FOUND_ERROR_MESSAGE = 'Запрашиваемый ресурс не найден';

// Маппинг ошибок
const errorMapping = {
  UserNotFound: [STATUS_CODE_NOT_FOUND, USER_NOT_FOUND_ERROR_MESSAGE],
  CardNotFound: [STATUS_CODE_NOT_FOUND, CARD_NOT_FOUND_ERROR_MESSAGE],
  ResourceNotFound: [STATUS_CODE_NOT_FOUND, RESOURCE_NOT_FOUND_ERROR_MESSAGE],
};

// Обработка ошибки валидации
const handleValidationError = (err, req, res) => {
  res
    .status(STATUS_CODE_BAD_REQUEST)
    .json({ message: VALIDATION_ERROR_MESSAGE });
};

// Обработка ошибки преобразования (CastError)
const handleCastError = (err, req, res) => {
  res.status(STATUS_CODE_BAD_REQUEST).json({ message: INVALID_ID_ERROR_MESSAGE });
};

// Обработка кастомных ошибок
const handleCustomErrors = (err, req, res) => {
  const errorInfo = errorMapping[err.message]
    || [STATUS_CODE_INTERNAL_SERVER_ERROR, DEFAULT_ERROR_MESSAGE];
  res.status(errorInfo[0]).json({ message: errorInfo[1] });
};

// Главный обработчик ошибок, который вызывает соответствующую функцию в зависимости от типа ошибки
// eslint-disable-next-line no-unused-vars
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
