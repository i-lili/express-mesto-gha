const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const { validateUser, validateLogin } = require('./middlewares/validation');

// Создание экземпляра приложения express
const app = express();
const port = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Использование middleware для разбора JSON
app.use(express.json());

// Обработчики для '/signin' и '/signup' с валидацией
app.post('/signin', validateLogin, login);
app.post('/signup', validateUser, createUser);

// Использование роутеров с промежуточным ПО авторизации
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

// Обработка неправильного пути
app.use((req, res, next) => {
  next(new Error('ResourceNotFound'));
});

// Включение обработчика ошибок Celebrate перед обработчиком ошибок
app.use(errors());

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(port);
