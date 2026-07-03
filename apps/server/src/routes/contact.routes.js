const express = require('express');
const router = express.Router();
const { submit, getAll, getOne, deleteOne } = require('../controllers/contact.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/', submit);
router.get('/', protect, getAll);
router.get('/:id', protect, getOne);
router.delete('/:id', protect, deleteOne);

module.exports = router;
