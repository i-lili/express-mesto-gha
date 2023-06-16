const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/Errors');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new UnauthorizedError('Authorization required');
    }

    const payload = await jwt.verify(token, 'secret-key');

    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
};
