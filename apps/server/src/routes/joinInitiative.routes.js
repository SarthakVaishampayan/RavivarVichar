const express = require('express');
const router = express.Router();
const { submit, getAll, getOne, updateStatus, deleteOne } = require('../controllers/joinInitiative.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', submit);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.put('/:id/status', protect, updateStatus);
router.delete('/:id', protect, deleteOne);

module.exports = router;
