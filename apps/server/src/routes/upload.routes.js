const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, uploadVideo, deleteOne } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadImages, uploadVideo: videoUpload } = require('../middlewares/upload.middleware');

router.post('/single', protect, uploadImages.single('file'), uploadSingle);
router.post('/multiple', protect, uploadImages.array('files', 10), uploadMultiple);
router.post('/video', protect, videoUpload.single('file'), uploadVideo);
router.delete('/', protect, deleteOne);

module.exports = router;
