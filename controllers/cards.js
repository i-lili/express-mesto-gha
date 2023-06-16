const Card = require('../models/card');

const {
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} = require('../errors/Errors');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (error) {
    next(error);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  try {
    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (error) {
    if (error.name === 'ValidationError') {
      next(new BadRequestError(error.message));
    } else {
      next(error);
    }
  }
};

const deleteCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    if (!card.owner.equals(userId)) {
      throw new ForbiddenError('Нельзя удалять чужие карточки');
    }

    await Card.deleteOne(card);
    res.send(card);
  } catch (error) {
    next(error);
  }
};

const likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
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
