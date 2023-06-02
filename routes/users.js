const express = require('express');
const usersController = require('../controllers/users');

const router = express.Router();

// GET /users
router.get('/', usersController.getUsers);

// GET /users/:userId
router.get('/:userId', usersController.getUserById);

// POST /users
router.post('/', usersController.createUser);

// PATCH /users/me
router.patch('/:userId', usersController.updateProfile);

// PATCH /users/me/avatar
router.patch('/:userId/avatar', usersController.updateAvatar);

module.exports = router;
