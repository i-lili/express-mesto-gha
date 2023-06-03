const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const errorHandler = require('./utils/errorHandler');

const app = express();
const port = 3000;

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Использование middleware для разбора JSON
app.use(express.json());

// Middleware для добавления id пользователя в объект запроса
app.use((req, res, next) => {
  req.user = {
    _id: '647905569c0c2773598bc9d7',
  };

  next();
});

// Использование роутеров
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Обработчик ошибок
app.use(errorHandler);

// Запуск сервера
app.listen(port);
