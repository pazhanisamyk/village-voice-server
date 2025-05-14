const express = require('express');
const router = express.Router();
const auth = require('./api/auth');  // Import user routes
const profile = require('./api/profile');  // Import profile routes
const complaintBox = require('./api/ComplaintBox');  // Import complaint box routes
const complaint = require('./api/Complaint');  // Import complaint routes
const events = require('./api/events');  // Import events routes

router.use(auth);
router.use(profile);
router.use(complaintBox);
router.use(complaint);
router.use(events);

module.exports = router;
