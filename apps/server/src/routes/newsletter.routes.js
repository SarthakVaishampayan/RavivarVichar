const express = require('express');
const router = express.Router();
const { subscribe, getAll, getOne, updateStatus, deleteOne } = require('../controllers/newsletter.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/subscribe', subscribe);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.put('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteOne);

module.exports = router;
