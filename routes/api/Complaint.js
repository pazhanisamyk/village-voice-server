// routes/api/complaintBox.js
const express = require('express');
const { authenticateUser } = require('../../middleware/authMiddleware');
const { createUserComplaint, getAllUserComplaint, getSingleUserComplaint, updateComplaintStatus } = require('../../controllers/Complaint');
const upload = require('../../middleware/upload');
const router = express.Router();

router.post('/create-user/complaint', authenticateUser, upload.single('image'), createUserComplaint);
router.get('/getAll-user/complaint', authenticateUser, getAllUserComplaint); 
router.get('/getSingle-user/complaint', authenticateUser, getSingleUserComplaint); 
router.put('/update-user/complaint', authenticateUser, updateComplaintStatus); 

module.exports = router;
