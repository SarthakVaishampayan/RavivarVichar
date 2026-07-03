const express = require('express');
const router = express.Router();
const { getAll, getOne, getBySlug, create, update, deleteOne } = require('../controllers/article.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { articleSchema } = require('@ravivarvichar/shared');

router.get('/', getAll);
router.get('/slug/:slug', getBySlug);
router.get('/:id', getOne);
router.post('/', protect, validate(articleSchema), create);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteOne);

module.exports = router;
