const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.resolve(__dirname, '../../uploads');

// Use disk storage in dev mode (no Cloudinary) so files are actually saved and served
const storage = process.env.CLOUDINARY_CLOUD_NAME
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        // Ensure the uploads directory exists
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) => {
        // Preserve original extension, add timestamp to avoid collisions
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 50);
        cb(null, `${Date.now()}-${name}${ext}`);
      },
    });

const fileFilter = (req, file, cb) => {
  // Accept all common image MIME types
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'image/bmp', 'image/tiff', 'image/svg+xml',
  ];
  if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, etc.)'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

module.exports = upload;
