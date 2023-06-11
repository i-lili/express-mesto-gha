const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

// GET /users
router.get('/', usersController.getUsers);

// GET /users/me
router.get('/me', usersController.getCurrentUser);

// GET /users/:userId
router.get('/:userId', usersController.getUserById);

// PATCH /users/me
router.patch('/me', usersController.updateProfile);

// PATCH /users/me/avatar
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
