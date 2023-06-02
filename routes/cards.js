const express = require('express');
const cardsController = require('../controllers/cards');

const router = express.Router();

// GET /cards
router.get('/', cardsController.getCards);

// POST /cards
router.post('/', cardsController.createCard);

// DELETE /cards/:cardId
router.delete('/:cardId', cardsController.deleteCard);

// PUT /cards/:cardId/likes
router.put('/:cardId/likes', cardsController.likeCard);

// DELETE /cards/:cardId/likes
router.delete('/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
