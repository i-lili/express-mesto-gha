const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

// GET /users
router.get('/', usersController.getUsers);

// GET /users/:userId
router.get('/:userId', usersController.getUserById);

// POST /user
router.get('/me', usersController.getCurrentUser);

// PATCH /users/me
router.patch('/me', usersController.updateProfile);

// PATCH /users/me/avatar
router.patch('/me/avatar', usersController.updateAvatar);

module.exports = router;
