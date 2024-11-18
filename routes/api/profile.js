const express = require('express');
const { updateProfile, viewProfile, changePassword, changeDarkmode, policies, help, reportProblem, changeLanguage } = require('../../controllers/profile');
const { authenticateUser } = require('../../middleware/authMiddleware');
const router = express.Router();

// Profile-related routes
router.post('/profile/update', authenticateUser, updateProfile);
router.post('/profile/changePassword', authenticateUser, changePassword);
router.post('/profile/changeDarkmode', authenticateUser, changeDarkmode);
router.post('/profile/changeLanguage', authenticateUser, changeLanguage);
router.get('/profile/view', authenticateUser, viewProfile);

// Information routes
router.get('/help', authenticateUser, help);
router.get('/policies', authenticateUser, policies);
router.get('/reportProblem', authenticateUser, reportProblem);

module.exports = router;
