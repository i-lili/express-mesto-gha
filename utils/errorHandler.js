const errorHandler = (err, res) => {
  let errorCode = 500;
  let errorMessage = 'Произошла ошибка';

  if (err.name === 'ValidationError') {
    errorCode = 400;
    errorMessage = 'Переданы некорректные данные';
  } else if (err.name === 'CastError') {
    errorCode = 404;
    errorMessage = 'Запрашиваемый пользователь или карточка не найдены';
  }

  res.status(errorCode).send({ message: errorMessage });
};

module.exports = errorHandler;
