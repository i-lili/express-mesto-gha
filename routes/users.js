const express = require('express');
const usersController = require('../controllers/users');
const {
  validateUserUpdate,
  validateAvatarUpdate,
  validateUserId,
} = require('../middlewares/validation');

const router = express.Router();

// GET /users - возвращает всех пользователей
router.get('/', usersController.getUsers);

// GET /users/me - возвращает информацию о текущем пользователе
router.get('/me', usersController.getCurrentUser);

// GET /users/:userId - возвращает пользователя по _id
router.get('/:userId', validateUserId, usersController.getUserById);

// PATCH /users/me - обновить профиль
router.patch('/me', validateUserUpdate, usersController.updateProfile);

// PATCH /users/me/avatar - обновить аватар
router.patch('/me/avatar', validateAvatarUpdate, usersController.updateAvatar);

module.exports = router;
