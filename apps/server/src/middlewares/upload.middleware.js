const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.resolve(__dirname, '../../uploads');

// Always use disk storage so files persist regardless of Cloudinary config
// Cloudinary upload is an additional step in the controller, not a storage decision
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    cb(null, `${Date.now()}-${name}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
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

// Accept all common video/audio MIME types for video uploads
// Also accept by file extension as a fallback since browsers report MIME types inconsistently
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.mpeg', '.mpg', '.3gp', '.wmv', '.mp3', '.wav', '.m4a', '.flac', '.aac'];

const videoFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isKnownVideo = VIDEO_EXTENSIONS.includes(ext);

  const allowedVideoTypes = [
    'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
    'video/x-msvideo', 'video/x-matroska', 'video/avi',
    'video/x-flv', 'video/mpeg', 'video/3gpp', 'video/x-ms-wmv',
    'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg',
    'audio/webm', 'audio/x-m4a', 'audio/flac',
  ];

  const hasKnownMime = allowedVideoTypes.includes(file.mimetype) ||
    file.mimetype.startsWith('video/') ||
    file.mimetype.startsWith('audio/');

  if (hasKnownMime || isKnownVideo) {
    cb(null, true);
  } else {
    // Log unknown MIME types, but still accept by known extension (browsers report inconsistently)
    console.warn(`⚠️  Unknown video MIME type: ${file.mimetype} (extension: ${ext}) — accepting by extension`);
    if (ext && VIDEO_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Cannot determine file type. Please use standard video/audio formats (MP4, WebM, MP3, etc.).'), false);
    }
  }
};

// Image upload: 50MB limit, images only
const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// Video upload: 4GB limit for large video files
const UPLOAD_VIDEO_LIMIT = 4 * 1024 * 1024 * 1024; // 4GB

const uploadVideo = multer({
  storage,
  fileFilter: videoFilter,
  limits: { fileSize: UPLOAD_VIDEO_LIMIT },
});

module.exports = { uploadImages, uploadVideo };

