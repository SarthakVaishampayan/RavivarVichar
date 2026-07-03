const express = require('express');
const router = express.Router();
const { create, getAll, update, deleteOne } = require('../controllers/donation.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', create);
router.get('/', protect, getAll);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
