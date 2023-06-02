const User = require('../models/user');

// GET /users - возвращает всех пользователей
const getUsers = (_, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// GET /users/:userId - возвращает пользователя по _id
const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send(user);
      else res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// POST /users - создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(400).send({ message: 'Некорректные данные для создания пользователя', error: err.message }));
};

// PATCH /users/me - обновляет профиль
const updateProfile = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// PATCH /users/me/avatar - обновляет аватар
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
