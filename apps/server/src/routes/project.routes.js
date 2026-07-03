const express = require('express');
const router = express.Router();
const { getAll, getOne, create, update, deleteOne } = require('../controllers/project.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', protect, create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
