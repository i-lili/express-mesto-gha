const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const auth = require('./middlewares/auth');
const routes = require('./routes');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(auth);
app.use(routes);

app.use((req, res, next) => {
  next(new Error('Запрашиваемый ресурс не найден'));
});

app.use(errors());
app.use(errorHandler);

app.listen(port);
