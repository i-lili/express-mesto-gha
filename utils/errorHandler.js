const errorHandler = (err, res) => {
  let status = 500;
  let message = 'Произошла ошибка';

  if (err.name === 'ValidationError' || err.kind === 'ObjectId') {
    status = 400;
    message = 'Переданы некорректные данные';
  } else if (err.message === 'NotFound') {
    status = 404;
    message = 'Объект не найден';
  }

  res.status(status).send({ message });
};

module.exports = errorHandler;
