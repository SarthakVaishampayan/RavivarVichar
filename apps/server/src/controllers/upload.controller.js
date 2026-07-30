const fs = require('fs');
const { cloudinary } = require('../config/cloudinary');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

// Helper: build response for a single file (always disk storage now)
const fileResponse = (file) => ({
  url: `/uploads/${file.filename}`,
  filename: file.originalname,
  size: file.size,
});

// Helper: upload a local file to Cloudinary
const uploadToCloudinary = (filePath, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'ravivarvichar', resource_type: 'auto', ...options },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(uploadStream);
    readStream.on('error', (err) => reject(err));
  });
};

// Upload single image
const uploadSingle = catchAsync(async (req, res) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);

  // File already saved to disk by multer
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    return sendSuccess(res, fileResponse(req.file), 'File uploaded', 200);
  }

  try {
    const result = await uploadToCloudinary(req.file.path);
    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      size: req.file.size,
    }, 'File uploaded', 201);
  } catch (error) {
    // Return local file if Cloudinary fails
    sendSuccess(res, fileResponse(req.file), 'File saved locally', 200);
  }
});

// Upload multiple images
const uploadMultiple = catchAsync(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return sendError(res, 'No files uploaded', 400);
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    const files = req.files.map(fileResponse);
    return sendSuccess(res, files, 'Files uploaded', 200);
  }

  const uploadPromises = req.files.map((file) =>
    uploadToCloudinary(file.path).then((result) => ({
      url: result.secure_url,
      publicId: result.public_id,
      filename: file.originalname,
    })).catch(() => fileResponse(file))
  );

  const results = await Promise.all(uploadPromises);
  sendSuccess(res, results, 'Files uploaded', 201);
});

// Upload a video/audio file
const uploadVideo = catchAsync(async (req, res) => {
  if (!req.file) return sendError(res, 'No file uploaded', 400);

  // Always save locally first (disk storage always used)
  // If Cloudinary is configured and file is under 100MB, also upload there
  const localUrl = `/uploads/${req.file.filename}`;

  if (!process.env.CLOUDINARY_CLOUD_NAME || req.file.size > 100 * 1024 * 1024) {
    // No Cloudinary or file too large — return local URL immediately
    return sendSuccess(res, {
      url: localUrl,
      filename: req.file.originalname,
      size: req.file.size,
    }, 'Video uploaded', 200);
  }

  // File is under 100MB and Cloudinary is configured — try Cloudinary upload
  try {
    const result = await uploadToCloudinary(req.file.path, {
      folder: 'ravivarvichar/videos',
      resource_type: 'video',
      chunk_size: 6000000,
    });

    sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      size: req.file.size,
      duration: result.duration || null,
    }, 'Video uploaded', 201);
  } catch (error) {
    // Cloudinary failed — return the local URL we already saved
    console.error('❌ Cloudinary upload failed, using local file:', error.message || error);
    return sendSuccess(res, {
      url: localUrl,
      filename: req.file.originalname,
      size: req.file.size,
    }, 'Video saved locally (Cloudinary upload failed)', 200);
  }
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

module.exports = { uploadSingle, uploadMultiple, uploadVideo, deleteOne };
