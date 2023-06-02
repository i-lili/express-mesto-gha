const Card = require('../models/card');

// GET /cards - возвращает все карточки
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// POST /cards - создаёт карточку
const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => res.status(400).send({ message: 'Некорректные данные для создания карточки', error: err.message }));
};

// DELETE /cards/:cardId - удаляет карточку по идентификатору
const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (card) res.send(card);
      else res.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// PUT /cards/:cardId/likes - поставить лайк карточке
const likeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

// DELETE /cards/:cardId/likes - убрать лайк с карточки
const dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: 'Ошибка на сервере', error: err.message }));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
