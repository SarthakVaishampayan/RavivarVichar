const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, deleteOne } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/single', protect, upload.single('file'), uploadSingle);
router.post('/multiple', protect, upload.array('files', 10), uploadMultiple);
router.delete('/', protect, deleteOne);

module.exports = router;
