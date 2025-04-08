// routes/api/userRoutes.js
const express = require('express');
const { signUp, signIn, logout } = require('../../controllers/auth');
const { authenticateUser } = require('../../middleware/authMiddleware');
const router = express.Router();

router.post('/auth/register', signUp);
router.post('/auth/login', signIn);
router.get('/auth/logout', logout);

module.exports = router;
