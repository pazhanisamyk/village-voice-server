const express = require('express');
const router = express.Router();
const auth = require('./api/auth');  // Import user routes
const profile = require('./api/profile');  // Import user routes

router.use(auth);
router.use(profile);

module.exports = router;
