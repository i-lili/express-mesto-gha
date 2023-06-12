// Импортируем модуль Joi, который поможет нам в валидации данных
const Joi = require('joi');

// Определяем схему для пользователей
const userSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(30),
  avatar: Joi.string().uri(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Определяем схему для входа в систему
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

// Определяем схему для карточек
const cardSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  link: Joi.string().uri().required(),
});

module.exports = {
  userSchema,
  loginSchema,
  cardSchema,
};
