// routes/api/events.js
const express = require('express');
const { sendOtp, verifyOtp, forgotPassword } = require('../../controllers/emailOtp');
const router = express.Router();

router.post('/send/otp', sendOtp);
router.post('/verify/otp', verifyOtp);
router.post('/forgot/password', forgotPassword);

module.exports = router;
