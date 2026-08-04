const express = require('express');
const router = express.Router();
const { submit, getAll, getOne, updateStatus, deleteOne } = require('../controllers/featureRequest.controller');
const { protect } = require('../middlewares/auth.middleware');
const { publicFormLimiter } = require('../middlewares/rateLimiter.middleware');

router.post('/', publicFormLimiter, submit);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.put('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteOne);

module.exports = router;
