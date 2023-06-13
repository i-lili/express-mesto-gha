const express = require('express');
const usersController = require('../controllers/users');
const {
  validateUserUpdate,
  validateAvatarUpdate,
  validateUser,
  validateLogin,
  validateUserId,
} = require('../middlewares/validation');

const router = express.Router();

// GET /users - возвращает всех пользователей
router.get('/', usersController.getUsers);

// GET /users/me - возвращает информацию о текущем пользователе
router.get('/me', usersController.getCurrentUser);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', validateUserId, usersController.getUserById);

// POST /signup - создаёт пользователя
router.post('/signup', validateUser, usersController.createUser);

// POST /signin - авторизация пользователя
router.post('/signin', validateLogin, usersController.login);

// PATCH /users/me - обновить профиль
router.patch('/me', validateUserUpdate, usersController.updateProfile);

// PATCH /users/me/avatar - обновить аватар
router.patch('/me/avatar', validateAvatarUpdate, usersController.updateAvatar);

module.exports = router;
