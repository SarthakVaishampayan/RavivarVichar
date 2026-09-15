const express = require('express');
const router = express.Router();
const { getAll, create, update, deleteOne } = require('../controllers/gallery.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getAll);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.patch('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
