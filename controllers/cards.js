const Card = require('../models/card');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../errors/Errors');

// GET /cards - возвращает все карточки
const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

// POST /cards - создаёт карточку
const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при создании карточки'));
    } else {
      next(error);
    }
  }
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (!card.owner.equals(userId)) {
      throw new ForbiddenError('Недостаточно прав для удаления карточки');
    }

    const deletedCard = await Card.deleteOne(card);
    res.send(deletedCard);
  } catch (error) {
    next(error);
  }
};

// PUT /cards/:cardId/likes - ставит лайк карточке
const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (error) {
    next(error);
  }
};

// DELETE /cards/:cardId/likes - убирает лайк с карточки
const dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
