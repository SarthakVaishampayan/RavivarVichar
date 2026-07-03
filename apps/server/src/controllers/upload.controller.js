const { cloudinary } = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// Upload single image
const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Dev mode: return a fake URL
    return sendSuccess(res, {
      url: `/uploads/${req.file.originalname}`,
      filename: req.file.originalname,
      size: req.file.size,
    }, 'File uploaded (dev mode)', 200);
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
    // Dev mode: return fake URLs
    const files = req.files.map((f) => ({
      url: `/uploads/${f.originalname}`,
      filename: f.originalname,
      size: f.size,
    }));
    return sendSuccess(res, files, 'Files uploaded (dev mode)', 200);
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
