const express = require('express');
const router = express.Router();
const { globalSearch } = require('../controllers/search.controller');

// GET /api/v1/search?q=keyword
router.get('/', globalSearch);

module.exports = router;
