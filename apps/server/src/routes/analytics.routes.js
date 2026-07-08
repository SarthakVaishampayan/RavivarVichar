const express = require('express');
const router = express.Router();
const { getSummary, recordPageview, getTraffic } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');
const { pageviewLimiter } = require('../middlewares/rateLimiter.middleware');

// Protected routes (admin only)
router.get('/summary', protect, getSummary);
router.get('/traffic', protect, getTraffic);

// Public route — pageview tracking (rate-limited)
router.post('/pageview', pageviewLimiter, recordPageview);

module.exports = router;
