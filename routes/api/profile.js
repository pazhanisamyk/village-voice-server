const express = require('express');
const { updateProfile, viewProfile, changePassword, policies, help, reportProblem, changeLanguage, changeTheme } = require('../../controllers/profile');
const { authenticateUser } = require('../../middleware/authMiddleware');
const router = express.Router();

// Profile-related routes
router.post('/profile/update', authenticateUser, updateProfile);
router.post('/profile/changePassword', authenticateUser, changePassword);
router.post('/profile/changeTheme', authenticateUser, changeTheme);
router.post('/profile/changeLanguage', authenticateUser, changeLanguage);
router.get('/profile/view', authenticateUser, viewProfile);

// Information routes
router.get('/help', authenticateUser, help);
router.get('/policies', authenticateUser, policies);
router.get('/reportProblem', authenticateUser, reportProblem);

module.exports = router;
