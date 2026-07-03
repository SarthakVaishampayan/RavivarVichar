const { cloudinary } = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// Helper: build response for a single file (works for both disk and memory storage)
const fileResponse = (file) => ({
  url: file.path
    ? `/uploads/${file.filename}`  // disk storage
    : `/uploads/${file.originalname}`, // fallback
  filename: file.originalname || file.filename,
  size: file.size,
});

// Upload single image
const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Dev mode: file is saved to disk by multer's diskStorage
    return sendSuccess(res, fileResponse(req.file), 'File uploaded', 200);
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ravivarvichar', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      size: req.file.size,
    }, 'File uploaded', 201);
  } catch (error) {
    sendError(res, 'Upload failed', 500);
  }
});

// Upload multiple images
const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, 'No files uploaded', 400);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Dev mode: files are saved to disk by multer's diskStorage
    const files = req.files.map(fileResponse);
    return sendSuccess(res, files, 'Files uploaded', 200);
  }

  const uploadPromises = req.files.map((file) => {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'ravivarvichar', resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error);
          else resolve({ url: result.secure_url, publicId: result.public_id, filename: file.originalname });
        }
      );
      uploadStream.end(file.buffer);
    });
  });

  const results = await Promise.all(uploadPromises);
  sendSuccess(res, results, 'Files uploaded', 201);
});

// Delete image from Cloudinary
const deleteOne = catchAsync(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) return sendError(res, 'publicId is required', 400);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return sendSuccess(res, null, 'File deleted (dev mode)');
  }

  await cloudinary.uploader.destroy(publicId);
  sendSuccess(res, null, 'File deleted');
});

module.exports = { uploadSingle, uploadMultiple, deleteOne };
