// Определяем константы для HTTP-статусов
const STATUS_CODES = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Определяем константы для сообщений об ошибках
const ERROR_MESSAGES = {
  DEFAULT: 'Внутренняя ошибка сервера',
  VALIDATION: 'Переданы некорректные данные',
  INVALID_ID: 'Передан некорректный id',
  USER_NOT_FOUND: 'Пользователь не найден',
  CARD_NOT_FOUND: 'Карточка не найдена',
  RESOURCE_NOT_FOUND: 'Запрашиваемый ресурс не найден',
  INVALID_CREDENTIALS: 'Неправильные почта или пароль',
  EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует',
  AUTHORIZATION_REQUIRED: 'Необходима авторизация',
  FORBIDDEN: 'Нельзя удалять чужие карточки',
};

// Создаем карту ошибок, связывающую типы ошибок с их HTTP-статусами и сообщениями
const errorMapping = {
  UserNotFound: [STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND],
  CardNotFound: [STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.CARD_NOT_FOUND],
  ResourceNotFound: [STATUS_CODES.NOT_FOUND, ERROR_MESSAGES.RESOURCE_NOT_FOUND],
  InvalidCredentials: [STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS],
  EmailAlreadyExists: [STATUS_CODES.CONFLICT, ERROR_MESSAGES.EMAIL_ALREADY_EXISTS],
  AuthorizationRequired: [STATUS_CODES.UNAUTHORIZED, ERROR_MESSAGES.AUTHORIZATION_REQUIRED],
  Forbidden: [STATUS_CODES.FORBIDDEN, ERROR_MESSAGES.FORBIDDEN],
  ValidationError: [STATUS_CODES.BAD_REQUEST, ERROR_MESSAGES.VALIDATION],
  default: [STATUS_CODES.INTERNAL_SERVER_ERROR, ERROR_MESSAGES.DEFAULT],
};

// Обработчик ошибок валидации
const handleValidationError = (err, req, res) => {
  const errors = err.details.map((detail) => detail.message);
  res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.VALIDATION, errors });
};

// Обработчик ошибок преобразования (CastError)
const handleCastError = (err, req, res) => {
  res.status(STATUS_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_ID });
};

// Обработчик кастомных ошибок
const handleCustomErrors = (err, req, res) => {
  const [status, message] = errorMapping[err.message] || errorMapping.default;
  res.status(status).json({ message });
};

// Главный обработчик ошибок, выбирает подходящую функцию обработки в зависимости от типа ошибки
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

// Экспорт обработчика ошибок
module.exports = errorHandler;
