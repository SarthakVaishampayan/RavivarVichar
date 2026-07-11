const express = require('express');
const router = express.Router();

// Auth
router.use('/auth', require('./auth.routes'));

// Content CRUD
router.use('/articles', require('./article.routes'));
router.use('/partners', require('./partner.routes'));
router.use('/events', require('./event.routes'));
router.use('/testimonials', require('./testimonial.routes'));

// Submissions
router.use('/newsletter', require('./newsletter.routes'));
router.use('/contact', require('./contact.routes'));
router.use('/feature-requests', require('./featureRequest.routes'));
router.use('/join-initiative', require('./joinInitiative.routes'));
router.use('/partner-applications', require('./partnerApplication.routes'));

// Upload & Analytics
router.use('/upload', require('./upload.routes'));
router.use('/analytics', require('./analytics.routes'));

// Gallery
router.use('/gallery', require('./gallery.routes'));

// Media Mentions
router.use('/media-mentions', require('./mediaMention.routes'));

// Homepage builder
router.use('/homepage', require('./homepage.routes'));

// Health check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'RavivarVichar API is running', timestamp: new Date().toISOString() });
});

// Expose server-side config (CLIENT_URL for admin "Visit Website" button)
const env = require('../config/env');
router.get('/config', (req, res) => {
  res.json({ success: true, data: { clientUrl: env.CLIENT_URL } });
});

module.exports = router;
