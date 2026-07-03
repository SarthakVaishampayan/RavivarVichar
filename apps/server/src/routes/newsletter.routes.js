const express = require('express');
const router = express.Router();
const { subscribe, getAll, deleteOne } = require('../controllers/newsletter.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/subscribe', subscribe);
router.get('/', protect, getAll);
router.delete('/:id', protect, deleteOne);

module.exports = router;
