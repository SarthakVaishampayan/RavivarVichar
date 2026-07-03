const express = require('express');
const router = express.Router();
const { apply, getAll, update, deleteOne } = require('../controllers/membership.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', apply);
router.get('/', protect, getAll);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
