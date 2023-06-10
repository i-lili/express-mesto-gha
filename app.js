const express = require('express');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users'); // Добавить import для login и createUser
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');

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

// Обработчики для '/signin' и '/signup'
app.post('/signin', login);
app.post('/signup', createUser);

// Использование роутеров
app.use('/users', auth, usersRouter);
app.use('/cards', auth, cardsRouter);

// Обработка неправильного пути
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  next(new Error('ResourceNotFound'));
});

// Обработка ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(port);
