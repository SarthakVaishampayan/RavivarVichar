const express = require('express');
const router = express.Router();
const { getAll, getOne, getBySlug, create, update, deleteOne } = require('../controllers/recognition.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:id', getOne);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
