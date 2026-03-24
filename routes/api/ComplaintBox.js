// routes/api/complaintBox.js
const express = require('express');
const { authenticateUser, isAdmin } = require('../../middleware/authMiddleware');
const { createComplaintBox, getAllComplaintBox, updateComplaintBox } = require('../../controllers/ComplaintBox');
const upload = require('../../middleware/upload');
const router = express.Router();

router.post('/create/complaintbox', authenticateUser, isAdmin, upload.single('image'), createComplaintBox);
router.put('/update/complaintbox', authenticateUser, isAdmin, upload.single('image'), updateComplaintBox);
router.get('/getAll/complaintbox', authenticateUser, getAllComplaintBox);

module.exports = router;
