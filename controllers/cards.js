const Card = require('../models/card');
const { cardSchema } = require('../middlewares/schemas');

// GET /cards - возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards - создаёт карточку
const createCard = (req, res, next) => {
  const { error } = cardSchema.validate(req.body);

  if (error) {
    next(error);
    return;
  }

  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new Error('CardNotFound');
      }
      if (!card.owner.equals(userId)) {
        throw new Error('Forbidden');
      }
      return Card.deleteOne(card);
    })
    .then((card) => res.send(card))
    .catch(next);
};

// PUT /cards/:cardId/likes - ставит лайк карточке
const likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new Error('CardNotFound');
      }
      res.send(card);
    })
    .catch(next);
};

// DELETE /cards/:cardId/likes - убирает лайк с карточки
const dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new Error('CardNotFound');
      }
      res.send(card);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
