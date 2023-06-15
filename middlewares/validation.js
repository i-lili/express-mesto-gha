const { celebrate, Joi, Segments } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.message('Неправильный формат ссылки');
  }
  return value;
};

// Схема валидации данных пользователя
const validateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// Схема валидации данных для входа в систему
const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// Схема валидации данных карточки
const validateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(validateURL).required(),
  }),
});

// Валидация идентификатора карточки
const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
});

// Схема валидации обновления профиля пользователя
const validateUserUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

// Схема валидации обновления аватара пользователя
const validateAvatarUpdate = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().custom(validateURL),
  }),
});

// Валидация идентификатора пользователя
const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
});

module.exports = {
  validateUser,
  validateLogin,
  validateCard,
  validateCardId,
  validateUserUpdate,
  validateAvatarUpdate,
  validateUserId,
};
