const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.warn('⚠️  [imageOptimizer] sharp not available, uploads will not be auto-compressed:', err.message);
}

/**
 * Optimizes an uploaded image on disk:
 * - Auto-rotates based on EXIF orientation (prevents phone photos being rotated sideways)
 * - Caps max dimension to 1600px (retina-ready, preserves aspect ratio)
 * - Compresses JPEG/PNG/WebP with web-optimized settings
 * - Strips heavy camera metadata (EXIF/GPS/thumbnails)
 * - Atomic write: if anything fails, the original file is left untouched
 *
 * @param {Object} file - Express Multer file object ({ path, mimetype, size, ... })
 * @returns {Promise<Object>} The updated file object with new size
 */
async function optimizeImage(file) {
  if (!sharp || !file || !file.path) {
    return file;
  }

  // Skip non-raster or animated images
  if (file.mimetype === 'image/gif' || file.mimetype === 'image/svg+xml') {
    return file;
  }

  const originalPath = file.path;
  const tempPath = `${originalPath}.opt_${Date.now()}`;

  try {
    const image = sharp(originalPath);
    const metadata = await image.metadata();

    // Auto-orient based on EXIF tags before stripping metadata
    let pipeline = image.rotate();

    // Cap maximum resolution to 1600px width/height
    if (metadata.width > 1600 || metadata.height > 1600) {
      pipeline = pipeline.resize({
        width: metadata.width >= metadata.height ? 1600 : undefined,
        height: metadata.height > metadata.width ? 1600 : undefined,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    const ext = path.extname(originalPath).toLowerCase();

    if (ext === '.png' || file.mimetype === 'image/png') {
      pipeline = pipeline.png({
        compressionLevel: 8,
        palette: true,
        quality: 80,
      });
    } else if (ext === '.webp' || file.mimetype === 'image/webp') {
      pipeline = pipeline.webp({
        quality: 80,
      });
    } else {
      // Default to MozJPEG compression for JPEG/JPG/BMP/TIFF
      pipeline = pipeline.jpeg({
        quality: 80,
        mozjpeg: true,
      });
    }

    await pipeline.toFile(tempPath);

    const stat = await fs.promises.stat(tempPath);

    // Only replace original if the optimized file is valid and smaller (or if original was large)
    if (stat.size > 0 && (stat.size < file.size || file.size > 300 * 1024)) {
      await fs.promises.rename(tempPath, originalPath);
      file.size = stat.size;
    } else {
      // If the original was already smaller/better, discard the temp file
      await fs.promises.unlink(tempPath).catch(() => {});
    }
  } catch (err) {
    // Non-fatal safety guarantee: if sharp fails on a corrupted image, keep original
    console.error('⚠️  [imageOptimizer] Compression failed, keeping original:', err.message);
    await fs.promises.unlink(tempPath).catch(() => {});
  }

  return file;
}

/**
 * Optimizes an array of files in parallel
 * @param {Array<Object>} files
 * @returns {Promise<Array<Object>>}
 */
async function optimizeImages(files) {
  if (!Array.isArray(files) || files.length === 0) return files;
  return Promise.all(files.map((file) => optimizeImage(file)));
}

module.exports = { optimizeImage, optimizeImages };
