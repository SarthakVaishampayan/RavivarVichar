const express = require('express');
const router = express.Router();
const { getAll, create, deleteOne } = require('../controllers/gallery.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getAll);
router.post('/', protect, create);
router.delete('/:id', protect, deleteOne);

module.exports = router;
