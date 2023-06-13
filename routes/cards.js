const express = require('express');
const cardsController = require('../controllers/cards');
const { validateCard, validateCardId } = require('../middlewares/validation');

const router = express.Router();

// GET /cards - возвращает все карточки
router.get('/', cardsController.getCards);

// POST /cards - создаёт карточку
router.post('/', validateCard, cardsController.createCard);

// DELETE /cards/:cardId - удаляет карточку по идентификатору
router.delete('/:cardId', validateCardId, cardsController.deleteCard);

// PUT /cards/:cardId/likes - ставит лайк карточке
router.put('/:cardId/likes', validateCardId, cardsController.likeCard);

// DELETE /cards/:cardId/likes - убирает лайк с карточки
router.delete('/:cardId/likes', validateCardId, cardsController.dislikeCard);

module.exports = router;
