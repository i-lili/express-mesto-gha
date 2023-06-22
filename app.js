const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { validateUser, validateLogin } = require('./middlewares/validation');
const { NotFoundError } = require('./errors/Errors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger); // подключаем логгер запросов

app.use(express.json());
app.use(cookieParser());

app.post('/signup', validateUser, createUser);
app.post('/signin', validateLogin, login);

app.use(auth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Если ни один из маршрутов не сработал, то сработает это:
app.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errors()); // обработчик ошибок celebrate

app.use(errorLogger); // подключаем логгер ошибок

// централизованный обработчик ошибок
app.use(errorHandler);

app.listen(port);
