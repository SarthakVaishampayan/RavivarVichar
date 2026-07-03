const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/summary', protect, getSummary);

module.exports = router;
