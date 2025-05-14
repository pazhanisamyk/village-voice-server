const express = require('express');
const { updateProfile, viewProfile, changePassword, policies, help, reportProblem, changeLanguage, changeTheme, updateProfileImage } = require('../../controllers/profile');
const { authenticateUser } = require('../../middleware/authMiddleware');
const upload = require('../../middleware/upload');
const router = express.Router();

// Profile-related routes
router.post('/profile/update', authenticateUser, updateProfile);
router.post('/profile/update/image', authenticateUser, upload.single('image'), updateProfileImage);
router.post('/profile/changePassword', authenticateUser, changePassword);
router.post('/profile/changeTheme', authenticateUser, changeTheme);
router.post('/profile/changeLanguage', authenticateUser, changeLanguage);
router.get('/profile/view', authenticateUser, viewProfile);

// Information routes
router.get('/help', authenticateUser, help);
router.get('/policies', authenticateUser, policies);
router.get('/reportProblem', authenticateUser, reportProblem);

module.exports = router;
