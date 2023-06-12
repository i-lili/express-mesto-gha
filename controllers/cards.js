const Joi = require('joi');
const Card = require('../models/card');

// GET /cards - возвращает все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// POST /cards - создаёт карточку
const createCard = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  });

  const validationResult = schema.validate(req.body);

  if (validationResult.error) {
    throw new Error('ValidationError');
  }

  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
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