const express = require('express');
const router = express.Router();

// Auth
router.use('/auth', require('./auth.routes'));

// Content CRUD
router.use('/articles', require('./article.routes'));
router.use('/programs', require('./program.routes'));
router.use('/projects', require('./project.routes'));
router.use('/partners', require('./partner.routes'));
router.use('/reports', require('./report.routes'));
router.use('/directory', require('./directory.routes'));
router.use('/events', require('./event.routes'));
router.use('/media', require('./media.routes'));
router.use('/testimonials', require('./testimonial.routes'));

// Upload & Analytics
router.use('/upload', require('./upload.routes'));
router.use('/analytics', require('./analytics.routes'));

// Homepage builder
router.use('/homepage', require('./homepage.routes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'RavivarVichar API is running', timestamp: new Date().toISOString() });
});

module.exports = router;
