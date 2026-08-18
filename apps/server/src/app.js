const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const env = require('./config/env');
const errorHandler = require('./middlewares/error.middleware');
const routes = require('./routes');

const app = express();

// Trust the first proxy hop (nginx) so req.ip / rate limiting see real client IPs
app.set('trust proxy', 1);

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        mediaSrc: ["'self'", 'https:', 'data:', 'blob:'],
        frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com', 'https://player.vimeo.com'],
        connectSrc: ["'self'", 'https://api.resend.com', 'https://res.cloudinary.com'],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
app.use(
  cors({
    origin: [env.CLIENT_URL, env.ADMIN_URL].filter(Boolean),
    credentials: true,
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files (dev mode - disk storage)
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API routes
app.use('/api/v1', routes);

// SEO: dynamic sitemap.xml + robots.txt (served at the site root)
app.use(require('./routes/seo.routes'));

// Health check at root
app.get('/', (req, res) => {
  res.json({ success: true, message: 'RavivarVichar CMS API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
