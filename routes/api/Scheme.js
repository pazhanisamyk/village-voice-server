const express = require('express');
const { authenticateUser, isAdmin } = require('../../middleware/authMiddleware');
const { createScheme, updateScheme, getAllSchemes, deleteScheme } = require('../../controllers/Scheme');
const upload = require('../../middleware/upload');

const router = express.Router();

router.post('/create/scheme', authenticateUser, isAdmin, upload.single('image'), createScheme);
router.put('/update/scheme', authenticateUser, isAdmin, upload.single('image'), updateScheme);
router.get('/getAll/scheme', authenticateUser, getAllSchemes);
router.delete('/remove/scheme/:id', authenticateUser, isAdmin, deleteScheme);

module.exports = router;
