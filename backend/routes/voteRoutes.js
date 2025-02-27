const express = require('express');
const { createVote, getVotes, voteOption, toggleVoteActiveStatus, deleteVote } = require('../controllers/voteController');
const router = express.Router();

// Создать новое голосование
router.post('/create-vote', createVote);

// Получить все голосования
router.get('/', getVotes);

router.delete('/delete/:id', deleteVote);

// Проголосовать за вариант
router.put('/vote', voteOption);

router.put('/toggle-active/:id', toggleVoteActiveStatus);

module.exports = router;
