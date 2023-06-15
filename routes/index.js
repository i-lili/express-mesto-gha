const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const { validateUser, validateLogin } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

router.post('/signin', validateLogin, login);
router.post('/signup', validateUser, createUser);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;
