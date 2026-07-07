const express = require('express');
const { authenticateUser, isAdmin } = require('../../middleware/authMiddleware');
const { createPoll, getAllPolls, voteInPoll, deletePoll } = require('../../controllers/Poll');

const router = express.Router();

router.post('/create/poll', authenticateUser, isAdmin, createPoll);
router.get('/getAll/poll', authenticateUser, getAllPolls);
router.post('/vote/poll', authenticateUser, voteInPoll);
router.delete('/remove/poll/:id', authenticateUser, isAdmin, deletePoll);

module.exports = router;
