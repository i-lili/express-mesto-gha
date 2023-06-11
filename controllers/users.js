const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// GET /users - возвращает всех пользователей
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error('UserNotFound');
      }
      res.send(user);
    })
    .catch(next);
};

// GET /users/me - возвращает информацию о текущем пользователе
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error('UserNotFound');
      }
      res.send(user);
    })
    .catch(next);
};

// POST /signup - создаёт пользователя
const createUser = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    throw new Error('ValidationError');
  }

  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!password) {
    throw new Error('ValidationError');
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Error('EmailAlreadyExists');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(next);
};

// POST /signin - авторизация пользователя
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error('ValidationError');
  }

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new Error('InvalidCredentials');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new Error('InvalidCredentials');
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(next);
};

// PATCH /users/me - обновляет профиль
const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('UserNotFound');
      }
      res.send(user);
    })
    .catch(next);
};

// PATCH /users/me/avatar - обновляет аватар
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new Error('UserNotFound');
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
};
