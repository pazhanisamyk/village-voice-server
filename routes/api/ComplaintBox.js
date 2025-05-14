// routes/api/complaintBox.js
const express = require('express');
const { authenticateUser } = require('../../middleware/authMiddleware');
const { createComplaintBox, getAllComplaintBox } = require('../../controllers/ComplaintBox');
const upload = require('../../middleware/upload');
const router = express.Router();

router.post('/create/complaintbox', authenticateUser, upload.single('image'), createComplaintBox);
router.get('/getAll/complaintbox', authenticateUser, getAllComplaintBox);

module.exports = router;
