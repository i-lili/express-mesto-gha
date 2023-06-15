const {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors/Errors');

const errorHandler = (err, req, res, next) => {
  switch (err.constructor) {
    case BadRequestError:
      res.status(400).send({ message: err.message });
      break;
    case ConflictError:
      res.status(409).send({ message: err.message });
      break;
    case ForbiddenError:
      res.status(403).send({ message: err.message });
      break;
    case NotFoundError:
      res.status(404).send({ message: err.message });
      break;
    case UnauthorizedError:
      res.status(401).send({ message: err.message });
      break;
    case InternalServerError:
      res.status(500).send({ message: err.message });
      break;
    default:
      res.status(500).send({ message: 'На сервере произошла ошибка' });
  }

  next();
};

module.exports = errorHandler;
