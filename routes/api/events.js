// routes/api/events.js
const express = require('express');
const { authenticateUser } = require('../../middleware/authMiddleware');
const { addEvent, removeEvent, getallEvents } = require('../../controllers/events');
const router = express.Router();

router.post('/event/add-event', authenticateUser, addEvent);
router.delete('/event/delete-event/:id', authenticateUser, removeEvent); 
router.get('/event/getAll-event', authenticateUser, getallEvents); 

module.exports = router;
